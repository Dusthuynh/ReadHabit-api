import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';

type IComment = Partial<Comment>;

@Injectable()
export class CommentSeeder implements Seeder {
	constructor(
		@InjectRepository(Comment)
		private commentRepository: Repository<Comment>,
		@InjectRepository(Post)
		private postRepository: Repository<Post>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async seed(): Promise<any> {
		const level1Comments: IComment[] = [];
		const level2Comments: IComment[] = [];
		const level3Comments: IComment[] = [];
		const posts = await this.postRepository.find({ take: 10 });
		const users = await this.userRepository.find();

		for (const post of posts) {
			const totalComment = faker.number.int({ max: 5, min: 1 });
			for (let i = 0; i < totalComment; i++) {
				const data = this.commentRepository.create({
					postId: post.id,
					createdBy: faker.helpers.arrayElement(users),
					message: faker.lorem.text(),
					path: '',
				});

				let comment = await this.commentRepository.save(data);
				comment.path = `${comment.id},`;
				level1Comments.push(comment);
			}
		}
		await this.commentRepository.save(level1Comments);

		for (const l1Comment of level1Comments) {
			const totalComment = faker.number.int({ max: 3, min: 1 });
			for (let i = 0; i < totalComment; i++) {
				const data = this.commentRepository.create({
					postId: l1Comment.postId,
					parentId: l1Comment.id,
					createdBy: faker.helpers.arrayElement(users),
					message: faker.lorem.text(),
					path: '',
				});

				let comment = await this.commentRepository.save(data);
				comment.path = `${l1Comment.path}${comment.id},`;
				level2Comments.push(comment);
			}
		}
		await this.commentRepository.save(level2Comments);

		for (const l2Comment of level2Comments) {
			const totalComment = faker.number.int({ max: 2, min: 1 });
			for (let i = 0; i < totalComment; i++) {
				const data = this.commentRepository.create({
					postId: l2Comment.postId,
					parentId: l2Comment.id,
					createdBy: faker.helpers.arrayElement(users),
					message: faker.lorem.text(),
					path: '',
				});

				let comment = await this.commentRepository.save(data);
				comment.path = `${l2Comment.path}${comment.id},`;
				level3Comments.push(comment);
			}
		}
		await this.commentRepository.save(level3Comments);
	}

	async drop(): Promise<any> {
		await this.commentRepository.delete({});
	}
}
