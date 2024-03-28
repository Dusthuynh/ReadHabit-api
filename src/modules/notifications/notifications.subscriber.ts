import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	SoftRemoveEvent,
} from 'typeorm';
import {
	Notification,
	NotificationRecipient,
} from './entities/notification.entity';

@EventSubscriber()
export class NotificationSubscriber
	implements EntitySubscriberInterface<Notification>
{
	constructor(dataSource: DataSource) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return Notification;
	}

	async afterSoftRemove(
		event: SoftRemoveEvent<Notification>,
	): Promise<void | Promise<any>> {
		const notificationRecipientRepository = event.connection.getRepository(
			NotificationRecipient,
		);
		await notificationRecipientRepository.softDelete({
			notificationId: event.entityId,
		});
	}
}
