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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetCommentDto } from './dto/get-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
	constructor(private readonly commentService: CommentsService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Comment',
	})
	async getManyComment(@Query() filter: GetCommentDto) {
		return await this.commentService.getManyComment(filter);
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get comment by Id',
	})
	async findCommentById(@Param('id', ParseIntPipe) id: number) {
		return await this.commentService.findOneWithRelation({
			where: { id },
			relations: { post: true, createdBy: true },
		});
	}

	@ApiBearerAuth()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update comment by Id',
	})
	async updateComment(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('uid') userId: number,
		@Body() input: UpdateCommentDto,
	) {
		return await this.commentService.updateComment(id, userId, input);
	}

	@ApiBearerAuth()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete comment by Id',
	})
	async deleteComment(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('uid') userId: number,
	) {
		return await this.commentService.deleteComment(id, userId);
	}
}
