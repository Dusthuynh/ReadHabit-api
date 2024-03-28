import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { Tag } from './entities/tag.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { CategoriesService } from '../categories/categories.service';
import { GetTagDto } from './dto/get-tag.dto';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CurrentUserPayload } from 'src/shared/interfaces/current-user.interface';
import { USER_ROLE } from 'src/shared/enum/user.enum';

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

		//NOTE: process tags
		console.log(input.tags);
		input.tags = this.processStrings(input.tags);
		console.log(input.tags);

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

	private processStrings(strings: string[]): string[] {
		return strings.map((str) => {
			let trimmedStr = str.trim();
			let words = trimmedStr.split(/\s+/);
			let filteredWords = words.filter((word) => word !== '');
			let processedStr = filteredWords.join(' ');

			return processedStr;
		});
	}

	async updateTag(
		tagId: number,
		user: CurrentUserPayload,
		input: UpdateTagDto,
	) {
		const tag = await this.tagRepository.findOne({ where: { id: tagId } });
		if (user.role !== USER_ROLE.ADMIN) {
			if (user.uid == tag.createdById) {
				if (tag.isLock) {
					throw new ForbiddenException('Can not update tag when locked');
				}
				if (input.isLock) {
					throw new BadRequestException(
						'Not permission to update isLock of tag',
					);
				}
			} else {
				throw new ForbiddenException('Not permission to update tag');
			}
		}
		return await this.updateOne({ id: tagId }, input);
	}

	async deleteTag(tagId: number, user: CurrentUserPayload) {
		const tag = await this.tagRepository.findOne({ where: { id: tagId } });
		if (user.role !== USER_ROLE.ADMIN) {
			if (user.uid == tag.createdById) {
				if (tag.isLock) {
					throw new ForbiddenException('Can not delete tag when locked');
				}
			} else {
				throw new ForbiddenException('Not permission to delete tag');
			}
		}

		return await this.deleteOne({ id: tagId });
	}

	async updateLockTagByPost(postId: number) {
		const tags = await this.tagRepository
			.createQueryBuilder('tag')
			.innerJoin('tag.posts', 'post')
			.where('post.id = :postId', { postId })
			.getMany();
		tags.forEach((tag) => {
			tag.isLock = true;
		});
		await this.tagRepository.save(tags);
	}
}
