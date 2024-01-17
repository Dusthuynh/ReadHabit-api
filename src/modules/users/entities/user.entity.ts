import { Bookmark } from 'src/modules/bookmarks/entities/bookmark.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Rank } from 'src/modules/ranks/entities/rank.entity';
import { SharePost } from 'src/modules/share_posts/entities/share_post.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, OneToMany, ManyToMany, AfterLoad } from 'typeorm';

@Entity()
export class User extends BaseObject {
	@Column({ unique: true })
	email: string;

	@Column({ unique: true })
	username: string;

	@Column({ nullable: true })
	firstName: string;

	@Column({ nullable: true })
	lastName: string;

	@Column({ nullable: true })
	fullName: string;

	@Column()
	password: string;

	@Column({ nullable: true })
	refreshToken: string;

	@Column()
	active: boolean;

	@Column({
		nullable: true,
	})
	position: string;

	@Column({
		nullable: true,
	})
	job: string;

	@Column({
		nullable: true,
	})
	phoneNumber: string;

	@Column({
		nullable: true,
	})
	birthday: Date;

	@ManyToMany(() => Category, (category: Category) => category.users)
	categories: Category[];

	@OneToMany(() => Post, (post: Post) => post.createdBy)
	posts: Post[];

	@OneToMany(() => Comment, (comment: Comment) => comment.createdBy)
	comments: Comment[];

	@OneToMany(() => SharePost, (sharePost: SharePost) => sharePost.sharedBy)
	sharePosts: SharePost[];

	@ManyToMany(
		() => Notification,
		(notification: Notification) => notification.users,
	)
	notifications: Notification[];

	@OneToMany(() => Rank, (rank: Rank) => rank.owner)
	ranks: Rank[];

	@OneToMany(() => Bookmark, (bookmark: Bookmark) => bookmark.owner)
	bookmarks: Bookmark[];

	@AfterLoad()
	updateFullName() {
		this.fullName = `${this.lastName} ${this.firstName}`;
	}
}
