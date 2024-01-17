import { Bookmark } from 'src/modules/bookmarks/entities/bookmark.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, ManyToOne, Index } from 'typeorm';

@Entity()
@Index(['bookmarkId'])
export class BookmarkPost extends BaseObject {
	@Column()
	bookmarkId: number;

	@Column()
	postId: number;

	@Column()
	position: number;

	@ManyToOne(() => Post)
	post: Post;

	@ManyToOne(() => Bookmark)
	bookmark: Bookmark;
}
