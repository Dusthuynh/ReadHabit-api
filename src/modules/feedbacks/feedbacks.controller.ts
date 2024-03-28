import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetFeedbackDto } from './dto/get-feedback.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CheckFeedbackDto } from './dto/check-feedback.dto';
import { FeedbackService } from './feedbacks.service';
import { CurrentUserPayload } from 'src/shared/interfaces/current-user.interface';
import { USER_ROLE } from 'src/shared/enum/user.enum';

@Controller('feedback')
@ApiTags('feedback')
export class FeedbackController {
	constructor(private readonly feedbackService: FeedbackService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Feedback (ADMIN)',
	})
	async getManyFeedback(@Query() filter: GetFeedbackDto) {
		return await this.feedbackService.getManyFeedback(filter);
	}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create Feedback',
	})
	async createFeedback(
		@CurrentUser('uid') userId: number,
		@Body() input: CreateFeedbackDto,
	) {
		input.createById = userId;
		return await this.feedbackService.createOne(input);
	}

	@Patch('checking')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Check Feedback (ADMIN)',
	})
	async checkFeedbacks(
		@Body() input: CheckFeedbackDto,
		@CurrentUser() user: CurrentUserPayload,
	) {
		if (user.role !== USER_ROLE.ADMIN) {
			throw new BadRequestException('Not premission to check feedback');
		}
		return await this.feedbackService.checkFeedbacks(input);
	}
}
