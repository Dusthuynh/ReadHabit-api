import { BookmarkPost } from 'src/modules/bookmark_posts/entities/bookmark_post.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { ContentSource } from 'src/modules/content_sources/entities/content_source.entity';
import { Reaction } from 'src/modules/reactions/entities/reaction.entity';
import { Tag } from 'src/modules/tags/entities/tag.entities';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { POST_STATUS, POST_TYPE } from 'src/shared/enum/post.enum';
import {
	Column,
	Entity,
	ManyToOne,
	Index,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm';

@Entity()
@Index(['createdById', 'contentSourceId'])
export class Post extends BaseObject {
	@Column()
	title: string;

	@Column()
	content: string;

	@Column({ default: 0 })
	sharePostId: number;

	@Column({ nullable: true })
	originalPostURL: string;

	@Column()
	publishDate: Date;

	@Column({ nullable: true })
	imageURL: string;

	@Column({ type: 'enum', enum: POST_STATUS })
	status: POST_STATUS;

	@Column({ type: 'enum', enum: POST_TYPE })
	type: POST_TYPE;

	@Column({ nullable: true })
	readTime: number;

	@Column({ default: 0 })
	totalLike: number;

	@Column({ default: 0 })
	totalDislike: number;

	@Column({ default: 0 })
	totalShare: number;

	// RELATION
	@Column({ nullable: true })
	categoryId: number;

	@Column({ nullable: true })
	createdById: number;

	@Column({ nullable: true })
	contentSourceId: number;

	@ManyToOne(() => Category)
	category: Category;

	@ManyToOne(() => User)
	createdBy: User;

	@ManyToOne(() => ContentSource)
	contentSource: ContentSource;

	@OneToMany(() => Reaction, (reaction: Reaction) => reaction.post)
	reactions: Reaction[];

	@OneToMany(() => Comment, (comment: Comment) => comment.post)
	comments: Comment[];

	@ManyToMany(() => Tag)
	@JoinTable({ name: 'post_tag' })
	tags: Tag[];

	@OneToMany(
		() => BookmarkPost,
		(bookmarkPost: BookmarkPost) => bookmarkPost.post,
	)
	bookmarkPosts: BookmarkPost[];
}
