import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	Notification,
	NotificationRecipient,
} from './entities/notification.entity';
import { UsersModule } from '../users/users.module';
import { NotificationSubscriber } from './notifications.subscriber';

@Module({
	imports: [
		TypeOrmModule.forFeature([Notification, NotificationRecipient]),
		UsersModule,
	],
	providers: [NotificationsService, NotificationSubscriber],
	controllers: [NotificationsController],
	exports: [NotificationsService],
})
export class NotificationsModule {}
