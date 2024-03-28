import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Tag } from 'src/modules/tags/entities/tag.entities';
import { Category } from 'src/modules/categories/entities/category.entity';

type ITag = Partial<Tag>;

@Injectable()
export class TagSeeder implements Seeder {
	constructor(
		@InjectRepository(Tag)
		private tagRepository: Repository<Tag>,
		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,
	) {}

	async seed(): Promise<any> {
		const tags: ITag[] = [];
		const categories = await this.categoryRepository.find();
		for (const category of categories) {
			for (let i = 0; i < 10; i++) {
				const data = {
					name: faker.lorem.words({ min: 1, max: 4 }),
					categoryId: category.id,
					createdById: 1,
				};
				if (!tags.includes(data)) {
					tags.push(data);
				} else {
					i--;
				}
			}
		}
		await this.tagRepository.save(tags);
	}

	async drop(): Promise<any> {
		await this.tagRepository.delete({});
	}
}
