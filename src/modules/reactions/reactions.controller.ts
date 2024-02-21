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

@Controller('reactions')
@ApiTags('reactions')
export class ReactionsController {
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many reaction',
	})
	getManyReaction(@Query() filter: GetReactionDto) {
		return filter;
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get reaction by Id',
	})
	findReactionById(@Param('id', ParseIntPipe) id: number) {
		return id;
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete reaction by Id',
	})
	deleteReactionById(@Param('id', ParseIntPipe) id: number) {
		return id;
	}
}
