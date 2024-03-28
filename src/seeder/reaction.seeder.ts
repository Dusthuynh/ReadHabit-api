import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Reaction } from 'src/modules/reactions/entities/reaction.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { REACT_TYPE } from 'src/shared/enum/react.enum';

type IReaction = Partial<Reaction>;

@Injectable()
export class ReactionSeeder implements Seeder {
	constructor(
		@InjectRepository(Reaction)
		private reactionRepository: Repository<Reaction>,
		@InjectRepository(Post)
		private postRepository: Repository<Post>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async seed(): Promise<any> {
		const tags: IReaction[] = [];
		const posts = await this.postRepository.find();
		const users = await this.userRepository.find();
		for (const post of posts) {
			for (const user of users) {
				const data = new Reaction();
				data.postId = post.id;
				data.userId = user.id;
				data.type = faker.helpers.enumValue(REACT_TYPE);

				tags.push(data);
			}
		}

		await this.reactionRepository.save(tags);
	}

	async drop(): Promise<any> {
		await this.reactionRepository.delete({});
	}
}
