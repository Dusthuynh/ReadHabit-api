import { fa, faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import {
	Notification,
	NotificationRecipient,
} from 'src/modules/notifications/entities/notification.entity';
import { User } from 'src/modules/users/entities/user.entity';

type INotification = Partial<Notification>;
@Injectable()
export class NotificationSeeder implements Seeder {
	constructor(
		@InjectRepository(Notification)
		private notificationRepository: Repository<Notification>,
		@InjectRepository(NotificationRecipient)
		private notiRecipientRepository: Repository<NotificationRecipient>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async seed(): Promise<any> {
		// let items: INotification[] = [];
		const users = await this.userRepository.find();

		for (let i = 0; i < 10; i++) {
			// const notiData: INotification = {
			// 	message: faker.lorem.sentence(),
			// };
			const notiData = new Notification();
			notiData.message = faker.lorem.sentence();
			const newNotification = await this.notificationRepository.save(notiData);

			const randomUsers = faker.helpers.arrayElements(users, {
				max: 5,
				min: 3,
			});
			// const notiRecopients = [];
			for (const user of randomUsers) {
				const notiRecipientData = new NotificationRecipient();
				notiRecipientData.user = user;
				notiRecipientData.notification = newNotification;
				notiRecipientData.seen = faker.datatype.boolean();
				await this.notiRecipientRepository.save(notiRecipientData);
			}

			// notiData.recipients = notiRecopients;

			// items.push(notiData);
		}

		// console.log(items);

		// await this.notificationRepository.save(items);
	}

	async drop(): Promise<any> {
		await this.notificationRepository.delete({});
	}
}
