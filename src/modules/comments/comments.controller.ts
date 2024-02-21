import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetCommentDto } from './dto/get-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Comment',
	})
	getManyComment(@Query() filter: GetCommentDto) {
		return filter;
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get comment by Id',
	})
	findCommentById(@Param('id', ParseIntPipe) id: number) {
		return id;
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update comment by Id',
	})
	updateComment(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: UpdateCommentDto,
	) {
		return { id, input };
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete comment by Id',
	})
	deleteComment(@Param('id', ParseIntPipe) id: number) {
		return id;
	}
}
