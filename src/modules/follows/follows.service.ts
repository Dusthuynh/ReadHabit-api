import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { CreateFollowDto } from './dto/create-follow.dto';
import { BaseService } from 'src/shared/bases/service.base';
import { GetFollowDto } from './dto/get-follow.dto';

@Injectable()
export class FollowsService extends BaseService<Follow> {
	constructor(
		@InjectRepository(Follow)
		private followRepository: Repository<Follow>,
	) {
		super(followRepository);
	}

	async getManyFollow(filter: GetFollowDto) {
		const { limit, offset, sortField, sortOrder, ...condition } = filter;

		const where = {};
		if (filter.followeeId) {
			where['followeeId'] = filter.followeeId;
		}
		if (filter.followerId) {
			where['followerId'] = filter.followerId;
		}

		const order = {};
		if (sortField && sortOrder) {
			order[sortField] = sortOrder;
		}

		const [count, data] = await Promise.all([
			this.followRepository.count({
				where,
			}),
			this.followRepository.find({
				where,
				order,
				//NOTE: limit 100 rows
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				relations: { followee: true, follower: true },
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}
}
