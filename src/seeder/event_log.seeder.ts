import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { USER_ROLE } from 'src/shared/enum/user.enum';
import { EventLog } from 'src/modules/event_logs/entities/event_log.entity';
import { EVENT_ACTION } from 'src/shared/enum/event.enum';

type IEventLog = Partial<EventLog>;

@Injectable()
export class EventLogSeeder implements Seeder {
	constructor(
		@InjectRepository(EventLog)
		private eventLogRepository: Repository<EventLog>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Post)
		private postRepository: Repository<Post>,
	) {}

	async seed(): Promise<any> {
		const eventLogs: IEventLog[] = [];
		const users = await this.userRepository.find();
		const posts = await this.postRepository.find();

		for (const user of users) {
			if (user.role !== USER_ROLE.ADMIN) {
				let i = 0;
				const eLLength = faker.number.int({ max: 40, min: 10 });
				while (i <= eLLength) {
					const data: IEventLog = new EventLog();
					data.action = faker.helpers.enumValue(EVENT_ACTION);
					data.actorId = user.id;
					data.postId = faker.helpers.arrayElement(posts).id;
					data.createdAt = this.randomDateInRange();

					eventLogs.push(data);
					i++;
				}
			}
		}

		await this.eventLogRepository.save(eventLogs);
	}

	randomDateInRange() {
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 10 * 24 * 60 * 60 * 1000);
		return faker.date.between({ from: startDate, to: endDate });
	}

	async drop(): Promise<any> {
		await this.eventLogRepository.delete({});
	}
}
