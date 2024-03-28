import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { ContentSource } from './entities/content_source.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { CreateContentSourceDto } from './dto/create-content-source.dto';
import { UpdateContentSourceDto } from './dto/update-content-source.dto';
import { deleteFile } from 'helpers/config';

@Injectable()
export class ContentSourcesService extends BaseService<ContentSource> {
	constructor(
		@InjectRepository(ContentSource)
		private contentSourceRepository: Repository<ContentSource>,
	) {
		super(contentSourceRepository);
	}

	async findManyContentSource(filter: DefaultListDto) {
		const { limit, offset, sortField, sortOrder, ...condition } = filter;
		const where = {};
		if (condition?.searchField && condition?.searchValue) {
			where[condition.searchField] = ILike(`%${condition.searchValue}%`);
		}

		const order = {};
		if (sortField && sortOrder) {
			order[sortField] = sortOrder;
		}

		const [count, data] = await Promise.all([
			this.contentSourceRepository.count({
				where,
			}),
			this.contentSourceRepository.find({
				where,
				order,
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				relations: ['posts'],
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}

	async createContentSource(input: CreateContentSourceDto) {
		const contentSource = await this.contentSourceRepository.findOne({
			where: { name: input.name },
		});
		if (contentSource) {
			throw new BadRequestException(`Name: ${input.name} already exist.`);
		}

		const { contentSourceImage, ...data } = input;
		return await this.createOne(data);
	}

	async updateContentServiceById(id: number, input: UpdateContentSourceDto) {
		const data = await this.findOne({ id });
		const { name, avatar } = input;
		if (avatar) {
			deleteFile(data.avatar);
			data.avatar = avatar;
		}
		if (name) {
			data.name = name;
		}
		return await this.contentSourceRepository.save(data);
	}
}
