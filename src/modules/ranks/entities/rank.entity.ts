import { RankLevel } from 'src/modules/rank_levels/entities/rank_level.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, ManyToOne, Index } from 'typeorm';

@Entity()
@Index(['ownerId', 'isLock'])
export class Rank extends BaseObject {
	@Column()
	rankLevelId: number;

	@Column()
	ownerId: number;

	@Column()
	process: number;

	@Column({ default: false })
	isLock: boolean;

	@ManyToOne(() => User)
	owner: User;

	@ManyToOne(() => RankLevel)
	rankLevel: RankLevel;
}
