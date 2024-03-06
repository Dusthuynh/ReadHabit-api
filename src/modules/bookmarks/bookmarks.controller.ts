import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GetBookmarkDto } from './dto/get-bookmark.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { UpdateBookmarkPostPositionDto } from '../bookmark_posts/dto/update-boomark-post-position.dto';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
@ApiTags('bookmarks')
export class BookmarksController {
	constructor(private readonly bookmarkService: BookmarksService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get Many Bookmark',
	})
	async getManyBookmark(@Query() filter: GetBookmarkDto) {
		return await this.bookmarkService.getManyBookmark(filter);
	}

	@ApiBearerAuth()
	@Get('me')
	@ApiOperation({
		summary: 'Get My Bookmark',
	})
	async getMyManyBookmark(@CurrentUser('uid') userId: number) {
		return await this.bookmarkService.getMyManyBookmark(userId);
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Bookmark By Id',
	})
	async findBookmarkById(@Param('id', ParseIntPipe) id: number) {
		return await this.bookmarkService.findOneWithRelation({
			where: { id },
			relations: { owner: true, bookmarkPosts: { post: true } },
			order: {
				bookmarkPosts: { position: 'ASC' },
			},
		});
	}

	@ApiBearerAuth()
	@Post()
	@ApiOperation({
		summary: 'Create Bookmark',
	})
	async createBookmark(
		@CurrentUser('uid') userId: number,
		@Body() input: CreateBookmarkDto,
	) {
		return await this.bookmarkService.createBookmark(userId, input);
	}

	@ApiBearerAuth()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update Bookmark',
	})
	async updateBookMark(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('uid') userId: number,
		@Body() input: UpdateBookmarkDto,
	) {
		return await this.bookmarkService.updateBookmark(id, userId, input);
	}

	@ApiBearerAuth()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Bookmark',
	})
	async deleteBookMark(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('uid') userId: number,
	) {
		return await this.bookmarkService.deleteBookmark(id, userId);
	}

	//BOOKMARK POST
	@ApiBearerAuth()
	@Patch(':id/bookmark-post-position')
	@ApiOperation({
		summary: 'Update Bookmark Post position',
	})
	async updateBookmarkPostPosition(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('uid') userId: number,
		@Body() input: UpdateBookmarkPostPositionDto,
	) {
		return await this.bookmarkService.updateBookmarkPostPosition(
			id,
			userId,
			input,
		);
	}

	@ApiBearerAuth()
	@Delete(':id/bookmark-post/:bookmarkPostId')
	@ApiOperation({
		summary: 'Delete Bookmark Post',
	})
	async deleteBookMarkPost(
		@Param('id', ParseIntPipe) id: number,
		@Param('bookmarkPostId', ParseIntPipe) bookmarkPostId: number,
		@CurrentUser('uid') userId: number,
	) {
		return await this.bookmarkService.deleteBookmarkPost(
			id,
			bookmarkPostId,
			userId,
		);
	}
}
