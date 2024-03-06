import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	MoreThan,
	RemoveEvent,
} from 'typeorm';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { BookmarkPost } from '../bookmark_posts/entities/bookmark_post.entity';

@EventSubscriber()
export class BookmarkSubscriber implements EntitySubscriberInterface<Bookmark> {
	constructor(dataSource: DataSource) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return Bookmark;
	}

	async afterRemove(
		event: RemoveEvent<Bookmark>,
	): Promise<void | Promise<any>> {
		const connection = event.connection;
		const queryRunner = connection.createQueryRunner();
		const { position, ownerId } = event.entity;

		const bookmarkRepository = queryRunner.manager.getRepository(Bookmark);

		await bookmarkRepository.update(
			{
				position: MoreThan(position),
				ownerId,
			},
			{ position: () => 'position - 1' },
		);
	}

	async beforeRemove(
		event: RemoveEvent<Bookmark>,
	): Promise<void | Promise<any>> {
		const connection = event.connection;
		const queryRunner = connection.createQueryRunner();
		const bookmarkId = event.entityId;

		const bookmarkRepository = queryRunner.manager.getRepository(BookmarkPost);
		await bookmarkRepository.delete({ bookmarkId });
	}
}
