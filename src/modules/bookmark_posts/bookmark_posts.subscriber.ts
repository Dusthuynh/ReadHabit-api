import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	MoreThan,
	RemoveEvent,
} from 'typeorm';
import { BookmarkPost } from '../bookmark_posts/entities/bookmark_post.entity';

@EventSubscriber()
export class BookmarkPostSubscriber
	implements EntitySubscriberInterface<BookmarkPost>
{
	constructor(dataSource: DataSource) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return BookmarkPost;
	}

	async afterRemove(
		event: RemoveEvent<BookmarkPost>,
	): Promise<void | Promise<any>> {
		const connection = event.connection;
		const queryRunner = connection.createQueryRunner();
		const { position, bookmarkId } = event.entity;

		const bookmarkPostRepository =
			queryRunner.manager.getRepository(BookmarkPost);

		await bookmarkPostRepository.update(
			{
				position: MoreThan(position),
				bookmarkId,
			},
			{ position: () => 'position - 1' },
		);
	}
}
