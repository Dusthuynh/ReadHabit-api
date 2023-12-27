import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseObject {
	@Column()
	firstName: string;

	@Column()
	lastName: string;

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

	@Column()
	email: string;

	@Column({
		nullable: true,
	})
	phoneNumber: string;

	@Column({
		nullable: true,
	})
	birthday: Date;
}
