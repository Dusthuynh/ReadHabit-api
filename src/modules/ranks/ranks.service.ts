import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { Rank } from './entities/rank.entity';
import {
	Between,
	ILike,
	LessThanOrEqual,
	MoreThanOrEqual,
	Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetRankDto } from './dto/get-rank.dto';

@Injectable()
export class RankService extends BaseService<Rank> {
	constructor(
		@InjectRepository(Rank)
		private rankRepository: Repository<Rank>,
	) {
		super(rankRepository);
	}

	async getManyEventLog(filter: GetRankDto) {
		const {
			limit,
			offset,
			sortField,
			sortOrder,
			startDate,
			endDate,
			...condition
		} = filter;
		const where = {};
		if (condition?.searchField && condition?.searchValue) {
			where[condition.searchField] = ILike(`%${condition.searchValue}%`);
		}

		if (filter.isLock) {
			where['isLock'] = filter.isLock.toLowerCase() == 'true';
		}

		if (filter.ownerId) {
			where['ownerId'] = filter.ownerId;
		}

		if (filter.rankLevelId) {
			where['rankLevelId'] = filter.rankLevelId;
		}

		if (startDate && endDate) {
			where['createdAt'] = Between(startDate, endDate);
		} else if (startDate) {
			where['createdAt'] = MoreThanOrEqual(startDate);
		} else if (endDate) {
			where['createdAt'] = LessThanOrEqual(endDate);
		}

		const order = {};
		if (sortField && sortOrder) {
			order[sortField] = sortOrder;
		}

		const [count, data] = await Promise.all([
			this.rankRepository.count({
				where,
			}),
			this.rankRepository.find({
				where,
				order,
				//NOTE: limit 100 rows
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				relations: { rankLevel: true, owner: true },
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}
}
