import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Rank } from 'src/modules/ranks/entities/rank.entity';
import { USER_ROLE } from 'src/shared/enum/user.enum';
import { RankLevel } from 'src/modules/rank_levels/entities/rank_level.entity';
import { rankLevelData } from './data/rankLevel.data';

type IRank = Partial<Rank>;

@Injectable()
export class RankSeeder implements Seeder {
	constructor(
		@InjectRepository(Rank)
		private rankRepository: Repository<Rank>,
		@InjectRepository(RankLevel)
		private rankLevelRepository: Repository<RankLevel>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async seed(): Promise<any> {
		const ranks: IRank[] = [];
		const users = await this.userRepository.find();
		const rankLevels = await this.rankLevelRepository.save(rankLevelData);

		for (const user of users) {
			if (user.role !== USER_ROLE.ADMIN) {
				let i = 0;
				const rankLength = faker.number.int({ max: 30, min: 2 });
				while (i <= rankLength) {
					const data: IRank = new Rank();
					data.isLock = true;
					data.ownerId = user.id;
					data.process = 100;
					data.rankLevelId = faker.helpers.arrayElement(rankLevels).id;
					data.createdAt = this.randomDateInRange();
					ranks.push(data);
					i++;
				}

				//Current rank
				const data: IRank = new Rank();
				data.isLock = false;
				data.ownerId = user.id;
				data.process = 30;
				data.rankLevelId = faker.helpers.arrayElement(rankLevels).id;
				ranks.push(data);
				i++;
			}
		}

		await this.rankRepository.save(ranks);
	}

	randomDateInRange() {
		const endDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
		const startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000);
		return faker.date.between({ from: startDate, to: endDate });
	}

	async drop(): Promise<any> {
		await this.rankRepository.delete({});
	}
}
