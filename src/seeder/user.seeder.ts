import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Seeder } from 'nestjs-seeder';
import { User } from 'src/modules/users/entities/user.entity';
import { In, Repository } from 'typeorm';
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
		const users = userData;
		const categories = await this.categoryRepository.find();
		users[0].categories = [categories[1], categories[3], categories[6]];
		users[1].categories = [categories[2], categories[4], categories[5]];

		users[2].categories = [categories[7], categories[9], categories[11]];
		users[3].categories = [categories[8], categories[10], categories[12]];
		users[4].categories = [categories[13], categories[15], categories[17]];
		users[5].categories = [categories[14], categories[16], categories[18]];

		await this.userRepository.save(users);
	}

	async drop(): Promise<any> {
		await this.userRepository.delete({});
	}
}
