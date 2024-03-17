import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { Feedback } from './entities/feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CheckFeedbackDto } from './dto/check-feedback.dto';
import { GetFeedbackDto } from './dto/get-feedback.dto';

@Injectable()
export class FeedbackService extends BaseService<Feedback> {
	constructor(
		@InjectRepository(Feedback)
		private feedbackRepository: Repository<Feedback>,
	) {
		super(feedbackRepository);
	}

	async getManyFeedback(filter: GetFeedbackDto) {
		const { limit, offset, sortField, sortOrder, ...condition } = filter;
		const where = {};
		if (condition?.searchField && condition?.searchValue) {
			where[condition.searchField] = ILike(`%${condition.searchValue}%`);
		}

		if (filter.isCheck) {
			where['isCheck'] = filter.isCheck.toLowerCase() == 'true';
		}

		if (filter.createById) {
			where['createById'] = filter.createById;
		}

		const order = {};
		if (sortField && sortOrder) {
			order[sortField] = sortOrder;
		}

		const [count, data] = await Promise.all([
			this.feedbackRepository.count({
				where,
			}),
			this.feedbackRepository.find({
				where,
				order,
				//NOTE: limit 100 rows
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				relations: { createBy: true },
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}

	async checkFeedbacks(input: CheckFeedbackDto) {
		const data = [];
		for (const feedbackId of input.feedbackIds) {
			const feedback = await this.findOne({ id: feedbackId });
			feedback.isCheck = true;
			data.push(feedback);
		}

		return await this.feedbackRepository.save(data);
	}
}
