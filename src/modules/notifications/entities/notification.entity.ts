import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification extends BaseObject {
	@Column()
	message: string;

	@Column({ nullable: true })
	ownerId: number;

	@OneToMany(() => NotificationRecipient, (recipient) => recipient.notification)
	recipients: NotificationRecipient[];

	@OneToOne(() => User)
	owner: User;
}

@Entity()
export class NotificationRecipient {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	notificationId: number;

	@Column()
	userId: number;

	@Column({ default: false })
	seen: boolean;

	@ManyToOne(() => User, (user: User) => user.notifications)
	user: User;

	@ManyToOne(() => Notification, (noti: Notification) => noti.recipients)
	notification: Notification;
}
