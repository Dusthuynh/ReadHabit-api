import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetFeedbackDto } from './dto/get-feedback.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CheckFeedbackDto } from './dto/check-feedback.dto';

@Controller('feedback')
@ApiTags('feedback')
export class FeedbackController {
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Feedback (ADMIN)',
	})
	getManyFeedback(@Query() filter: GetFeedbackDto) {
		return filter;
	}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create Feedback',
	})
	createFeedback(
		@CurrentUser('uid') userId: number,
		@Body() input: CreateFeedbackDto,
	) {
		return { userId, input };
	}

	@Public()
	@Patch('checking')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Check Feedback (ADMIN)',
	})
	checkFeedback(@Body() input: CheckFeedbackDto) {
		return input;
	}
}
