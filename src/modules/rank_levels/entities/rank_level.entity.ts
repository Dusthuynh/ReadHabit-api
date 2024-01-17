import { Rank } from 'src/modules/ranks/entities/rank.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class RankLevel extends BaseObject {
	@Column()
	name: string;

	@OneToMany(() => Rank, (rank: Rank) => rank.rankLevel)
	ranks: Rank[];
}
