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

@Controller('bookmarks')
@ApiTags('bookmarks')
export class BookmarksController {
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get Many Bookmark',
	})
	getManyBookmark(@Query() filter: GetBookmarkDto) {
		return filter;
	}

	@Public()
	@Get('me')
	@ApiOperation({
		summary: 'Get My Bookmark',
	})
	getMyManyBookmark(@CurrentUser('uid') userId: number) {
		return userId;
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Bookmark By Id',
	})
	findBookmarkById(@Param('id', ParseIntPipe) id: number) {
		return id;
	}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create Bookmark',
	})
	createBookmark(
		@CurrentUser('uid') userId: number,
		@Body() input: CreateBookmarkDto,
	) {
		return { userId, input };
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update Bookmark',
	})
	updateBookMark(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: UpdateBookmarkDto,
	) {
		return { id, input };
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Bookmark',
	})
	deleteBookMark(@Param('id', ParseIntPipe) id: number) {
		return id;
	}

	//BOOKMARK POST
	@Public()
	@Patch(':id/bookmark-post-position')
	@ApiOperation({
		summary: 'Update Bookmark Post position',
	})
	updateBookmarkPostPosition(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: UpdateBookmarkPostPositionDto,
	) {
		return { id, input };
	}

	@Public()
	@Delete(':id/bookmark-post/:bookmarkPostId')
	@ApiOperation({
		summary: 'Delete Bookmark Post',
	})
	deleteBookMarkPost(
		@Param('id', ParseIntPipe) id: number,
		@Param('bookmarkPostId', ParseIntPipe) bookmarkPostId: number,
	) {
		return { id, bookmarkPostId };
	}
}
