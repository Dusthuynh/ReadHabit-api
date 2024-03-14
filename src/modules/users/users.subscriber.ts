import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	LoadEvent,
} from 'typeorm';
import { User } from './entities/user.entity';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { Follow } from '../follows/entities/follow.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
	constructor(dataSource: DataSource) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return User;
	}
	async afterLoad(
		entity: User,
		event?: LoadEvent<User>,
	): Promise<Promise<void | Promise<any>>> {
		const userId = entity.id;
		const followRepository = event.connection.getRepository(Follow);

		const [totalFollower, totalFollowee] = await Promise.all([
			followRepository.count({ where: { followeeId: userId } }),
			followRepository.count({ where: { followerId: userId } }),
		]);

		entity.totalFollower = totalFollower || 0;
		entity.totalFollowee = totalFollowee || 0;
	}

	async afterInsert(event: InsertEvent<User>): Promise<void | Promise<any>> {
		const bookmark = new Bookmark();
		bookmark.name = 'Xem sau';
		bookmark.position = 0;
		bookmark.owner = event.entity;

		await event.manager.getRepository(Bookmark).save(bookmark);
	}
}
