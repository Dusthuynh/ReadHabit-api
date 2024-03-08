import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { deleteFile } from 'helpers/config';

@Injectable()
export class CategoriesService extends BaseService<Category> {
	constructor(
		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,
	) {
		super(categoryRepository);
	}

	async createCategory(input: CreateCategoryDto) {
		const item = await this.categoryRepository.findOne({
			where: { name: input.name },
		});
		if (item) {
			throw new BadRequestException(`Name: ${input.name} already exist.`);
		}

		const { categoryImage, ...data } = input;
		return await this.createOne(data);
	}

	async updateCategoryById(id: number, input: UpdateCategoryDto) {
		const data = await this.findOne({ id });
		const { name, imageURL } = input;
		if (imageURL) {
			deleteFile(data.imageURL);
			data.imageURL = imageURL;
		}
		if (name) {
			data.name = name;
		}
		return await this.categoryRepository.save(data);
	}
}
