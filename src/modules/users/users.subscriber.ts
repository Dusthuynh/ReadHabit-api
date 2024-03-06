import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
} from 'typeorm';
import { User } from './entities/user.entity';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
	constructor(dataSource: DataSource) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return User;
	}

	async afterInsert(event: InsertEvent<User>): Promise<void | Promise<any>> {
		const bookmark = new Bookmark();
		bookmark.name = 'Xem sau';
		bookmark.position = 0;
		bookmark.owner = event.entity;

		await event.manager.getRepository(Bookmark).save(bookmark);
	}
}
