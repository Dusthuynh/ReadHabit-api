import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetReactionDto } from './dto/get-reaction.dto';
import { ReactionsService } from './reactions.service';

@Controller('reactions')
@ApiTags('reactions')
export class ReactionsController {
	constructor(private readonly reactionService: ReactionsService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many reaction',
	})
	async getManyReaction(@Query() filter: GetReactionDto) {
		return await this.reactionService.findManyReaction(filter);
	}
}
