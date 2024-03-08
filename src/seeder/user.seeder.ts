import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { userData } from './data/user.data';
import { Category } from 'src/modules/categories/entities/category.entity';

@Injectable()
export class UserSeeder implements Seeder {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,
	) {}

	async seed(): Promise<any> {
		const users = [];
		const categories = await this.categoryRepository.find();
		for (const user of userData) {
			user.categories = faker.helpers.arrayElements(categories, {
				min: 2,
				max: 4,
			});
			users.push(user);
		}
		await this.userRepository.save(users);
	}

	async drop(): Promise<any> {
		await this.userRepository.delete({});
	}
}
