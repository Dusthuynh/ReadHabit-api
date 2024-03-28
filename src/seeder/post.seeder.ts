import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Tag } from 'src/modules/tags/entities/tag.entities';
import { POST_STATUS, POST_TYPE } from 'src/shared/enum/post.enum';
import { Repository } from 'typeorm';

type IPost = Partial<Post>;
@Injectable()
export class PostSeeder implements Seeder {
	constructor(
		@InjectRepository(Post)
		private postRepository: Repository<Post>,
		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,
		@InjectRepository(Tag)
		private tagRepository: Repository<Tag>,
	) {}

	async seed(): Promise<any> {
		let items: IPost[] = [];
		const categories = await this.categoryRepository.find();
		for (const category of categories) {
			const tags = await this.tagRepository.find({
				where: { categoryId: category.id },
			});

			//NOTE: type: external_post & external_personal_blog
			for (let i = 0; i < 5; i++) {
				const data = {
					title: faker.lorem.sentence(),
					content: faker.lorem.paragraph(),
					originalPostURL: faker.internet.url(),
					publishDate: faker.date.recent(),
					imageURL: faker.image.url(),
					status: faker.helpers.enumValue(POST_STATUS),
					type: faker.helpers.arrayElement([
						POST_TYPE.EXTERNAL_PERSONAL_BLOG,
						POST_TYPE.EXTERNAL_POST,
					]) as POST_TYPE,
					readTime: faker.number.int({ max: 30, min: 1 }),
					categoryId: category.id,
					createdById: faker.number.int({ max: 6, min: 3 }),
					contentSourceId: faker.number.int({ max: 10, min: 1 }),
					tags: faker.helpers.arrayElements(tags, { min: 2, max: 4 }),
				};
				items.push(data);
			}

			//NOTE: type: internal_post
			for (let i = 0; i < 10; i++) {
				const data = {
					title: faker.lorem.sentence(),
					content: faker.lorem.paragraph(),
					publishDate: faker.date.recent(),
					imageURL: faker.image.url(),
					status: faker.helpers.enumValue(POST_STATUS),
					type: faker.helpers.arrayElement([
						POST_TYPE.INTERNAL_POST,
					]) as POST_TYPE,
					readTime: faker.number.int({ max: 30, min: 1 }),
					categoryId: category.id,
					createdById: faker.number.int({ max: 6, min: 3 }),
					tags: faker.helpers.arrayElements(tags),
				};
				items.push(data);
			}
		}

		await this.postRepository.save(items);

		items = [];
		const publishedPosts = await this.postRepository.find({
			where: { status: POST_STATUS.PUBLISHED },
		});
		//NOTE: type: internal_share
		for (let i = 0; i < 20; i++) {
			const randomPost = faker.helpers.arrayElement(publishedPosts);
			const data = {
				title: faker.lorem.sentence(),
				content: faker.lorem.paragraph(),
				imageURL: faker.image.url(),
				sharePostId: randomPost.id,
				status: POST_STATUS.PUBLISHED,
				type: faker.helpers.arrayElement([
					POST_TYPE.INTERNAL_SHARE,
				]) as POST_TYPE,
				readTime: faker.number.int({ max: 30, min: 1 }),
				createdById: faker.number.int({ max: 6, min: 3 }),
			};
			randomPost.totalShare += 1;
			await this.postRepository.save(randomPost);
			items.push(data);
		}
		await this.postRepository.save(items);
	}
	async drop(): Promise<any> {
		await this.postRepository.delete({});
	}
}
