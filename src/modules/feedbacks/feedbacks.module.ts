import { Module } from '@nestjs/common';
import { FeedbackService } from './feedbacks.service';
import { FeedbackController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Feedback])],
	providers: [FeedbackService],
	controllers: [FeedbackController],
	exports: [FeedbackService],
})
export class FeedbackModule {}
