import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class SharePost extends BaseObject {
	@Column()
	originalPostId: number;

	@Column()
	sharePostId: number;

	@Column()
	sharedById: number;

	@ManyToOne(() => Post)
	originalPost: Post;

	@ManyToOne(() => Post)
	sharePost: Post;

	@ManyToOne(() => User)
	sharedBy: User;
}
