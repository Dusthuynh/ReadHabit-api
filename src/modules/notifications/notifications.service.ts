import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserPayload } from 'src/shared/interfaces/current-user.interface';
import { ILike, In, Not, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { USER_ROLE } from 'src/shared/enum/user.enum';
import { Notification } from './entities/notification.entity';
import { NotificationRecipient } from './entities/notification.entity';
import { UsersService } from '../users/users.service';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { BaseService } from 'src/shared/bases/service.base';
import { GetNotificationDto } from './dto/get-notification.dto';
import { SeenNotiDto } from './dto/seen-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService extends BaseService<Notification> {
	constructor(
		@InjectRepository(Notification)
		private notificationRepository: Repository<Notification>,
		@InjectRepository(NotificationRecipient)
		private notificationRecipientRepo: Repository<NotificationRecipient>,
		private userService: UsersService,
	) {
		super(notificationRepository);
	}

	async findManyNotification(user: CurrentUserPayload, filter: DefaultListDto) {
		if (user.role !== USER_ROLE.ADMIN) {
			throw new ForbiddenException('No permission to find many notification');
		}
		const { limit, offset, sortField, sortOrder, ...condition } = filter;
		const where = {};
		if (condition?.searchField && condition?.searchValue) {
			where[condition.searchField] = ILike(`%${condition.searchValue}%`);
		}

		const order = {};
		if (sortField && sortOrder) {
			order[sortField] = sortOrder;
		}

		const [count, data] = await Promise.all([
			this.notificationRepository.count({
				where,
			}),
			this.notificationRepository.find({
				where,
				order,
				//NOTE: limit 100 rows
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				relations: { recipients: { user: true } },
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}

	async getMyNotifications(
		user: CurrentUserPayload,
		filter: GetNotificationDto,
	) {
		const { limit, offset, sortField, sortOrder, ...condition } = filter;
		const where = {};
		if (condition?.searchField && condition?.searchValue) {
			where[condition.searchField] = ILike(`%${condition.searchValue}%`);
		}
		const order = {};
		if (sortField && sortOrder) {
			order[sortField] = sortOrder;
		}

		where['userId'] = user.uid;
		if (filter.seen) {
			where['seen'] = filter.seen.toLowerCase() == 'true';
		}

		const [count, data] = await Promise.all([
			this.notificationRecipientRepo.count({
				where,
			}),
			this.notificationRecipientRepo.find({
				where,
				order,
				//NOTE: limit 100 rows
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				relations: { notification: true },
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}

	async createNotification(
		user: CurrentUserPayload,
		input: CreateNotificationDto,
	) {
		if (user.role !== USER_ROLE.ADMIN) {
			throw new ForbiddenException('No permission to create notification');
		}
		const notification = this.notificationRepository.create({
			message: input.message,
			ownerId: user.uid,
		});
		await this.notificationRepository.save(notification);

		const notificationRecipients: NotificationRecipient[] = [];
		for (const idrecipientId of input.recipientIds) {
			const user = await this.userService.findOneWithoutThrowError({
				id: idrecipientId,
			});
			if (user) {
				const data = new NotificationRecipient();
				data.notificationId = notification.id;
				data.userId = user.id;
				notificationRecipients.push(data);
			}
			if (notificationRecipients.length) {
				await this.notificationRecipientRepo.save(notificationRecipients);
			}
		}

		return await this.notificationRepository.findOne({
			where: { id: notification.id },
			relations: { recipients: { user: true } },
		});
	}

	async seenNotificationRecipient(
		user: CurrentUserPayload,
		input: SeenNotiDto,
	) {
		const notificationRecipients: NotificationRecipient[] = [];
		for (const notiId of input.notificationRecipientIds) {
			const notificationRecipient =
				await this.notificationRecipientRepo.findOne({
					where: { userId: user.uid, id: notiId },
				});
			if (notificationRecipient) {
				notificationRecipient.seen = true;
				notificationRecipients.push(notificationRecipient);
			}
		}
		return await this.notificationRecipientRepo.save(notificationRecipients);
	}

	async updateNotification(
		notiId: number,
		user: CurrentUserPayload,
		input: UpdateNotificationDto,
	) {
		if (user.role !== USER_ROLE.ADMIN) {
			throw new ForbiddenException('No permission to update notification');
		}
		const notification = await this.notificationRepository.findOne({
			where: { id: notiId },
			relations: { recipients: true },
		});
		if (!notification) {
			throw new BadRequestException('Notification not found!');
		}

		if (input.message) {
			notification.message = input.message;
		}

		if (input.recipientIds) {
			const recipients: NotificationRecipient[] = [];

			const removeRecipients = await this.notificationRecipientRepo.find({
				where: {
					notificationId: notification.id,
					userId: Not(In(input.recipientIds)),
				},
			});
			await this.notificationRecipientRepo.remove(removeRecipients);

			for (const recipientId of input.recipientIds) {
				const recipient = await this.notificationRecipientRepo.findOne({
					where: {
						userId: recipientId,
						notificationId: notification.id,
					},
				});
				if (recipient) {
					recipients.push(recipient);
				} else {
					const user = await this.userService.findOne({ id: recipientId });
					const data = new NotificationRecipient();
					data.notificationId = notification.id;
					data.userId = user.id;
					const newRecipient = await this.notificationRecipientRepo.save(data);
					recipients.push(newRecipient);
				}
			}
			notification.recipients = recipients;
		}

		return await this.notificationRepository.save(notification);
	}

	async deleteNotification(user: CurrentUserPayload, notiId: number) {
		if (user.role !== USER_ROLE.ADMIN) {
			throw new ForbiddenException('No permission to delete notification');
		}
		const notification = await this.notificationRepository.findOne({
			where: { id: notiId },
			relations: { recipients: true },
		});

		if (notification) {
			const data = await this.notificationRepository.softRemove(
				{ id: notiId },
				{ data: { notification } },
			);
		}

		return { success: true };
	}
}
