import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Reaction } from 'src/modules/reactions/entities/reaction.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { REACT_TYPE } from 'src/shared/enum/react.enum';
import { Follow } from 'src/modules/follows/entities/follow.entity';

type IFollow = Partial<Follow>;

@Injectable()
export class FollowSeeder implements Seeder {
	constructor(
		@InjectRepository(Follow)
		private followRepository: Repository<Follow>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async seed(): Promise<any> {
		const follows: IFollow[] = [];
		const users = await this.userRepository.find();
		// for (let i = 0; i < users.length; i++) {
		// 	for (let j = 0; j < users.length; j++) {
		// 		if (j != i) {
		// 			const data = new Follow();
		// 			data.followerId = users[i].id;
		// 			data.followeeId = users[j].id;
		// 			follows.push(data);
		// 		}
		// 	}
		// }
		for (const user of users) {
			const userArray = users.filter((person) => person.id !== user.id);
			const randomUsers = faker.helpers.arrayElements(userArray, {
				min: 3,
				max: 5,
			});

			for (const randomUser of randomUsers) {
				const data = new Follow();
				data.followerId = user.id;
				data.followeeId = randomUser.id;
				follows.push(data);
			}
		}

		await this.followRepository.save(follows);
	}

	async drop(): Promise<any> {
		await this.followRepository.delete({});
	}
}
