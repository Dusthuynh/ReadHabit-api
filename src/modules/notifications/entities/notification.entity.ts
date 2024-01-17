import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { NOTIFICATION_STATUS } from 'src/shared/enum/notification.enum';
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Notification extends BaseObject {
	@Column()
	title: string;

	@Column()
	content: string;

	@Column()
	status: NOTIFICATION_STATUS;

	@ManyToMany(() => User, (user: User) => user.notifications)
	@JoinTable({ name: 'user_notification' })
	users: User[];
}
