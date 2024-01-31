import { Bookmark } from 'src/modules/bookmarks/entities/bookmark.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Rank } from 'src/modules/ranks/entities/rank.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, OneToMany, ManyToMany, AfterLoad } from 'typeorm';

@Entity()
export class User extends BaseObject {
	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	username: string;

	@Column({ nullable: true })
	firstName: string;

	@Column({ nullable: true })
	lastName: string;

	@Column({ nullable: true })
	fullName: string;

	@Column({ nullable: true })
	refreshToken: string;

	@Column({
		nullable: true,
	})
	phoneNumber: string;

	@Column({
		nullable: true,
	})
	birthday: Date;

	@Column({ nullable: true })
	avatar: string;

	// RELATION
	@ManyToMany(() => Category, (category: Category) => category.users)
	categories: Category[];

	@OneToMany(() => Post, (post: Post) => post.createdBy)
	posts: Post[];

	@OneToMany(() => Comment, (comment: Comment) => comment.createdBy)
	comments: Comment[];

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
