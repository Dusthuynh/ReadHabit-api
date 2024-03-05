import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { Tag } from './entities/tag.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { CategoriesService } from '../categories/categories.service';
import { GetTagDto } from './dto/get-tag.dto';
import { ESortOrder } from 'src/shared/enum/sort.enum';

@Injectable()
export class TagsService extends BaseService<Tag> {
	constructor(
		@InjectRepository(Tag)
		private tagRepository: Repository<Tag>,
		private categoryService: CategoriesService,
	) {
		super(tagRepository);
	}

	async findManyTag(filter: GetTagDto) {
		const { limit, offset, sortField, sortOrder, ...condition } = filter;
		const where = {};
		if (condition?.searchField && condition?.searchValue) {
			where[condition.searchField] = ILike(`%${condition.searchValue}%`);
		}

		if (filter.categoryId) {
			where['categoryId'] = filter.categoryId;
		}

		if (filter.createdById) {
			where['createdById'] = filter.createdById;
		}

		const order = {};
		if (sortField && sortOrder) {
			order[sortField] = sortOrder;
		}

		const [count, data] = await Promise.all([
			this.tagRepository.count({
				where,
			}),
			this.tagRepository.find({
				where,
				order,
				//NOTE: limit 100 rows
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				relations: ['posts', 'category'],
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}

	async createTags(userId: number, input: CreateTagDto) {
		const category = await this.categoryService.findOne({
			id: input.categoryId,
		});

		const existingTags = await this.tagRepository.find({
			where: {
				name: In(input.tags),
				categoryId: category.id,
			},
		});

		const newTags: Tag[] = [];
		for (const tagName of input.tags) {
			const existingTag = existingTags.find((tag) => tag.name === tagName);
			if (!existingTag) {
				const data = new Tag();
				data.name = tagName;
				data.categoryId = category.id;
				data.createdById = userId;
				newTags.push(data);
			}
		}

		const newData = await this.tagRepository.save(newTags);
		return [...newData, ...existingTags];
	}
}
