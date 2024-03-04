import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as fs from 'fs';
import { AddCategoryDto } from './dto/add-category.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class UsersService extends BaseService<User> {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private categoryService: CategoriesService,
	) {
		super(userRepository);
	}

	async findUserById(id: number): Promise<User | null> {
		const data = await this.userRepository.findOne({
			where: { id },
			select: [
				'username',
				'phoneNumber',
				'avatar',
				'birthday',
				'createdAt',
				'id',
				'firstName',
				'lastName',
				'fullName',
			],
			relations: {
				categories: true,
			},
		});
		if (!data) {
			throw new NotFoundException('User not found!');
		}

		return data;
	}

	async uploadAvatar(userId: number, filePath: string): Promise<User | null> {
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) {
			throw new NotFoundException('User not found!');
		}

		if (user.avatar) {
			// delete oldFile
			const oldFilePath = user.avatar;
			fs.unlink(oldFilePath, (err) => {
				if (err) {
					console.error('Error while deleting the file:', err);
				}
			});
		}
		user.avatar = filePath;
		return await this.userRepository.save(user);
	}

	async addCategories(userId: number, input: AddCategoryDto) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: { categories: true },
		});
		if (!user) {
			throw new NotFoundException('User not found!');
		}

		const categories = await this.categoryService.findAllData({
			id: In(input.categoryIds),
		});
		user.categories = categories;
		return await this.userRepository.save(user);
	}
}
