import { BookmarkPost } from 'src/modules/bookmark_posts/entities/bookmark_post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@Index(['ownerId'])
export class Bookmark extends BaseObject {
	@Column()
	name: string;

	@Column()
	ownerId: number;

	@ManyToOne(() => User)
	owner: User;

	@OneToMany(
		() => BookmarkPost,
		(bookmarkPost: BookmarkPost) => bookmarkPost.bookmark,
	)
	bookmarkPosts: BookmarkPost[];
}
