import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

@Entity()
@Index(['postId', 'parentId'])
export class Comment extends BaseObject {
	@Column()
	message: string;

	@Column()
	postId: number;

	@Column({ nullable: true })
	parentId: number;

	@Column()
	path: string;

	@Column()
	createdById: number;

	@ManyToOne(() => Post, (post: Post) => post.comments)
	post: Post;

	@ManyToOne(() => User, (user: User) => user.comments)
	createdBy: User;

	@ManyToOne(() => Comment)
	parent: Comment;
}
