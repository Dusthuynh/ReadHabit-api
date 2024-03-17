import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Feedback } from 'src/modules/feedbacks/entities/feedback.entity';
import { USER_ROLE } from 'src/shared/enum/user.enum';

type IFeedback = Partial<Feedback>;

@Injectable()
export class FeedbackSeeder implements Seeder {
	constructor(
		@InjectRepository(Feedback)
		private feedbackRepository: Repository<Feedback>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async seed(): Promise<any> {
		const feedbacks: IFeedback[] = [];
		const users = await this.userRepository.find();
		for (const user of users) {
			if (user.role !== USER_ROLE.ADMIN) {
				let i = 0;
				const fBLength = faker.number.int({ max: 3, min: 1 });
				while (i <= fBLength) {
					const data: IFeedback = new Feedback();
					data.title = faker.lorem.sentence();
					data.description = faker.lorem.paragraph();
					data.isCheck = faker.datatype.boolean();
					data.createById = user.id;

					feedbacks.push(data);
					i++;
				}
			}
		}

		await this.feedbackRepository.save(feedbacks);
	}

	async drop(): Promise<any> {
		await this.feedbackRepository.delete({});
	}
}
