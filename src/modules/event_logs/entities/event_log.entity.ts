import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { EVENT_ACTION } from 'src/shared/enum/event.enum';
import { Column, Entity, ManyToOne, Index } from 'typeorm';

@Entity()
@Index(['actorId'])
export class EventLog extends BaseObject {
	@Column()
	action: EVENT_ACTION;

	@Column()
	actorId: number;

	@Column()
	postId: number;

	@Column({ nullable: true })
	note: string;

	@ManyToOne(() => User)
	actor: User;

	@ManyToOne(() => Post)
	post: Post;
}
