import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	LoadEvent,
	SoftRemoveEvent,
	UpdateEvent,
} from 'typeorm';
import { Post } from './entities/post.entity';
import { Reaction } from '../reactions/entities/reaction.entity';
import { REACT_TYPE } from 'src/shared/enum/react.enum';
import { BookmarkPost } from '../bookmark_posts/entities/bookmark_post.entity';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
	constructor(dataSource: DataSource) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return Post;
	}

	async afterLoad(
		entity: Post,
		event?: LoadEvent<Post>,
	): Promise<Promise<void | Promise<any>>> {
		const postId = entity.id;
		const reactionRepository = event.connection.getRepository(Reaction);
		const postRepository = event.connection.getRepository(Post);

		const [totalLike, totalDislike, totalShare] = await Promise.all([
			reactionRepository.count({ where: { postId, type: REACT_TYPE.LIKE } }),
			reactionRepository.count({ where: { postId, type: REACT_TYPE.DISLIKE } }),
			postRepository.count({ where: { sharePostId: postId } }),
		]);

		entity.totalLike = totalLike || 0;
		entity.totalDislike = totalDislike || 0;
		entity.totalShare = totalShare || 0;
	}

	async afterUpdate(event: UpdateEvent<Post>): Promise<void | Promise<any>> {
		const connection = event.connection;
		const queryRunner = connection.createQueryRunner();

		if (event.updatedColumns.length) {
			for (const updateColumn of event.updatedColumns) {
				const post = event.entity;

				const columnName = updateColumn.propertyName;
				const bPRepository = queryRunner.manager.getRepository(BookmarkPost);
				if (columnName === 'title') {
					await bPRepository.update({ postId: post.id }, { title: post.title });
				}

				if (columnName === 'imageURL') {
					await bPRepository.update(
						{ postId: post.id },
						{ imageURL: post.imageURL },
					);
				}
			}
		}
	}

	async afterSoftRemove(
		event: SoftRemoveEvent<Post>,
	): Promise<void | Promise<any>> {
		const bPRepository = event.connection.getRepository(BookmarkPost);
		await bPRepository.update({ postId: event.entityId }, { isDeleted: true });
	}
}
