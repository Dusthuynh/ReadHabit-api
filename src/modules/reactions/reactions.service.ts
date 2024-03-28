import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { Reaction } from './entities/reaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { REACT_TYPE } from 'src/shared/enum/react.enum';
import { GetReactionDto } from './dto/get-reaction.dto';

@Injectable()
export class ReactionsService extends BaseService<Reaction> {
	constructor(
		@InjectRepository(Reaction)
		private reactionRepository: Repository<Reaction>,
	) {
		super(reactionRepository);
	}

	async findManyReaction(filter: GetReactionDto) {
		const { limit, offset, sortField, sortOrder, ...condition } = filter;
		const where = {};
		if (condition?.searchField && condition?.searchValue) {
			where[condition.searchField] = ILike(`%${condition.searchValue}%`);
		}

		if (filter.postId) {
			where['postId'] = filter.postId;
		}

		if (filter.userId) {
			where['userId'] = filter.userId;
		}

		if (filter.type) {
			where['type'] = filter.type;
		}

		const order = {};
		if (sortField && sortOrder) {
			order[sortField] = sortOrder;
		}

		const [count, data] = await Promise.all([
			this.reactionRepository.count({
				where,
			}),
			this.reactionRepository.find({
				where,
				order,
				//NOTE: limit 100 rows
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				relations: ['post', 'user'],
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}
}
