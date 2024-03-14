import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['followerId', 'followeeId'])
export class Follow extends BaseObject {
	@Column()
	followerId: number;

	@Column()
	followeeId: number;

	@ManyToOne(() => User)
	follower: User;

	@ManyToOne(() => User)
	followee: User;
}
