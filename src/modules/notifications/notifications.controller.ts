import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetNotificationDto } from './dto/get-notification.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { SeenNotiDto } from './dto/seen-notification.dto';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserPayload } from 'src/shared/interfaces/current-user.interface';
import { USER_ROLE } from 'src/shared/enum/user.enum';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController {
	constructor(private readonly notificationService: NotificationsService) {}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get many Notifications (ADMIN)',
	})
	async getManyNotification(
		@Query() filter: DefaultListDto,
		@CurrentUser() user: CurrentUserPayload,
	) {
		return await this.notificationService.findManyNotification(user, filter);
	}

	@Get('me')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get My Notifications',
	})
	async getMyNotifications(
		@CurrentUser() user: CurrentUserPayload,
		@Query() filter: GetNotificationDto,
	) {
		return await this.notificationService.getMyNotifications(user, filter);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get Notifications by Id (ADMIN)',
	})
	async getNotificationById(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: CurrentUserPayload,
	) {
		if (user.role !== USER_ROLE.ADMIN) {
			throw new BadRequestException('No permission to find notifications');
		}
		const data = await this.notificationService.findOneWithRelation({
			where: { id },
			relations: { recipients: { user: true } },
		});
		if (!data) {
			throw new BadRequestException('Data not found');
		}
		return data;
	}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create Notifications (ADMIN)',
	})
	async createNotification(
		@Body() input: CreateNotificationDto,
		@CurrentUser() user: CurrentUserPayload,
	) {
		return await this.notificationService.createNotification(user, input);
	}

	@Patch('notificationRecipient')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Seen notifications',
	})
	async seenNotificationRecipient(
		@Body() input: SeenNotiDto,
		@CurrentUser() user: CurrentUserPayload,
	) {
		return await this.notificationService.seenNotificationRecipient(
			user,
			input,
		);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update Notifications (ADMIN)',
	})
	async updateNotification(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: UpdateNotificationDto,
		@CurrentUser() user: CurrentUserPayload,
	) {
		return await this.notificationService.updateNotification(id, user, input);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete Notifications (ADMIN)',
	})
	async deleteNotification(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: CurrentUserPayload,
	) {
		return await this.notificationService.deleteNotification(user, id);
	}
}
