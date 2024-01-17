import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Feedback extends BaseObject {
	@Column()
	createById: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column({ default: false })
	isCheck: boolean;

	@ManyToOne(() => User)
	createBy: User;
}
