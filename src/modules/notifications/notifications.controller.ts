import {
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetNotificationDto } from './dto/get-notification.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { SeenNotiDto } from './dto/seen-notification.dto';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController {
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Notifications (ADMIN)',
	})
	getManyNotification(@Query() filter: DefaultListDto) {
		return filter;
	}

	@Public()
	@Get('me')
	@ApiOperation({
		summary: 'Get My Notifications',
	})
	getMyNotification(@Query() filter: GetNotificationDto) {
		return filter;
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Notifications by Id (ADMIN)',
	})
	getNotificationById(@Param('id', ParseIntPipe) id: number) {
		return id;
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create Notifications (ADMIN)',
	})
	createNotification(@Body() input: CreateNotificationDto) {
		return input;
	}

	@Public()
	@Patch('notificationRecipient')
	@ApiOperation({
		summary: 'Seen notifications',
	})
	seenNotificationRecipient(@Body() input: SeenNotiDto) {
		return input;
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update Notifications (ADMIN)',
	})
	updateNotification(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: UpdateNotificationDto,
	) {
		return { id, input };
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Notifications (ADMIN)',
	})
	deleteNotification(@Param('id', ParseIntPipe) id: number) {
		return id;
	}
}
