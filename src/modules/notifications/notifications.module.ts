import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	Notification,
	NotificationRecipient,
} from './entities/notification.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Notification, NotificationRecipient])],
	providers: [NotificationsService],
	controllers: [NotificationsController],
	exports: [NotificationsService],
})
export class NotificationsModule {}
