import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Repository } from 'typeorm';
import { categoryData } from './data/category.data';

type ICategory = Partial<Category>;
@Injectable()
export class CategorySeeder implements Seeder {
	constructor(
		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,
	) {}

	async seed(): Promise<any> {
		const items: ICategory[] = categoryData;
		await this.categoryRepository.save(items);
	}
	async drop(): Promise<any> {
		await this.categoryRepository.delete({});
	}
}
