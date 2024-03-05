import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	LoadEvent,
} from 'typeorm';
import { Post } from './entities/post.entity';
import { Reaction } from '../reactions/entities/reaction.entity';
import { REACT_TYPE } from 'src/shared/enum/react.enum';

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
		const connection = event.connection;
		const queryRunner = connection.createQueryRunner();
		const postId = entity.id;

		const reactRepository = queryRunner.manager.getRepository(Reaction);
		const postRepository = queryRunner.manager.getRepository(Post);

		entity.totalLike = await reactRepository.count({
			where: { postId: postId, type: REACT_TYPE.LIKE },
		});
		entity.totalDislike = await reactRepository.count({
			where: { postId: postId, type: REACT_TYPE.DISLIKE },
		});

		entity.totalShare = await postRepository.count({
			where: { sharePostId: postId },
		});
	}
}
