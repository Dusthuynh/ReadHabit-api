import { Bookmark } from 'src/modules/bookmarks/entities/bookmark.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { NotificationRecipient } from 'src/modules/notifications/entities/notification.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Rank } from 'src/modules/ranks/entities/rank.entity';
import { Reaction } from 'src/modules/reactions/entities/reaction.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { USER_ROLE } from 'src/shared/enum/user.enum';
import {
	Column,
	Entity,
	OneToMany,
	ManyToMany,
	AfterLoad,
	JoinTable,
} from 'typeorm';

@Entity()
export class User extends BaseObject {
	@Column({ unique: true })
	email: string;

	@Column({ select: false })
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
	about: string;

	@Column({ nullable: true })
	youtubeLink: string;

	@Column({ nullable: true })
	facebookLink: string;

	@Column({ nullable: true })
	linkedinLink: string;

	@Column({ nullable: true })
	twitterLink: string;

	@Column({ default: 0 })
	totalFollower: number;

	@Column({ default: 0 })
	totalFollowee: number;

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

	@Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.MEMBER })
	role: USER_ROLE;

	// RELATION
	@ManyToMany(() => Category)
	@JoinTable({ name: 'user_category' })
	categories: Category[];

	@OneToMany(() => Post, (post: Post) => post.createdBy)
	posts: Post[];

	@OneToMany(() => Reaction, (reaction: Reaction) => reaction.user)
	reactions: Reaction[];

	@OneToMany(() => Comment, (comment: Comment) => comment.createdBy)
	comments: Comment[];

	@OneToMany(
		() => NotificationRecipient,
		(noti: NotificationRecipient) => noti.user,
	)
	notifications: NotificationRecipient[];

	@OneToMany(() => Rank, (rank: Rank) => rank.owner)
	ranks: Rank[];

	@OneToMany(() => Bookmark, (bookmark: Bookmark) => bookmark.owner)
	bookmarks: Bookmark[];

	@AfterLoad()
	updateFullName() {
		this.fullName = `${this.lastName} ${this.firstName}`;
	}
}
