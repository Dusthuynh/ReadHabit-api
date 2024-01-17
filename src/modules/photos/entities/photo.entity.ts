import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Photo extends BaseObject {
	@Column()
	link: string;

	@Column({ nullable: true })
	description: string;
}
