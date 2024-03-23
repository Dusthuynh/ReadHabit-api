import { Injectable } from '@nestjs/common';
import { EventLog } from './entities/event_log.entity';
import { BaseService } from 'src/shared/bases/service.base';
import { InjectRepository } from '@nestjs/typeorm';
import {
	Between,
	ILike,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
	Repository,
} from 'typeorm';
import { GetEventLogDto } from './dto/get-event-logs.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { PostEvent } from './events/post.event';

@Injectable()
export class EventLogsService extends BaseService<EventLog> {
	constructor(
		@InjectRepository(EventLog)
		private eventLogRepository: Repository<EventLog>,
	) {
		super(eventLogRepository);
	}

	async getManyEventLog(filter: GetEventLogDto) {
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

		if (filter.action) {
			where['action'] = In(filter.action);
		}

		if (filter.actorId) {
			where['actorId'] = filter.actorId;
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
			this.eventLogRepository.count({
				where,
			}),
			this.eventLogRepository.find({
				where,
				order,
				//NOTE: limit 100 rows
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				relations: { actor: true, post: true },
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}

	@OnEvent('post.*')
	async createPostEventLog(payload: PostEvent) {
		const data = this.eventLogRepository.create(payload);
		await this.eventLogRepository.save(data);
	}
}
