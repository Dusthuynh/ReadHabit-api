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
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetPostDto } from './dto/get-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { CreateReactionDto } from '../reactions/dto/create-reaction.dto';
import { SharePostDto } from './dto/share-post.dto';
import { CreateBookmarkPostDto } from '../bookmark_posts/dto/create-bookmark-post.dto';
import { ReviewPostDto } from './dto/review-post.dto';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
	@Public()
	@Get('')
	@ApiOperation({
		summary: 'Get many Post',
	})
	getManyPost(@Query() filter: GetPostDto) {
		return filter;
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Post by Id',
	})
	findPostById(@Param('id', ParseIntPipe) id: number) {
		return id;
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create Post',
	})
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('postImage', {
			storage: storageConfig('post'),
			fileFilter(req, file, cb) {
				if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
					req.fileValidationError =
						'Wrong extension type. Accepted file ext are: jpg|jpeg|png';
					cb(null, false);
				} else {
					const fileSize = parseInt(req.headers['content-length']);
					if (fileSize > 1024 * 1024 * 5) {
						req.fileValidationError =
							'File size is too large. Accepted file size is less than 5MB';
						cb(null, false);
					} else {
						cb(null, true);
					}
				}
			},
		}),
	)
	createPost(
		@Body() input: CreatePostDto,
		@UploadedFile() postImage: Express.Multer.File,
	) {
		return { input, postImage };
	}

	@Public()
	@Post(':id/review')
	reviewPost(
		@Body() input: ReviewPostDto,
		@Param('id', ParseIntPipe) id: number,
	) {
		return { id, input };
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update Post by Id',
	})
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('postImage', {
			storage: storageConfig('post'),
			fileFilter(req, file, cb) {
				if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
					req.fileValidationError =
						'Wrong extension type. Accepted file ext are: jpg|jpeg|png';
					cb(null, false);
				} else {
					const fileSize = parseInt(req.headers['content-length']);
					if (fileSize > 1024 * 1024 * 5) {
						req.fileValidationError =
							'File size is too large. Accepted file size is less than 5MB';
						cb(null, false);
					} else {
						cb(null, true);
					}
				}
			},
		}),
	)
	updatePost(
		@UploadedFile() postImage: Express.Multer.File,
		@Body() input: UpdatePostDto,
		@Param('id', ParseIntPipe) id: number,
	) {
		return { id, input, postImage };
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Post by Id',
	})
	deletePost(@Param('id', ParseIntPipe) id: number) {
		//TODO: Before delete post, check the related
		return id;
	}

	//COMMENTS
	@Public()
	@Post(':id/comments')
	@ApiOperation({
		summary: 'Create Comment by post Id',
	})
	commentPost(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: CreateCommentDto,
	) {
		return { id, input };
	}

	//REACTIONS
	@Public()
	@Post(':id/react')
	@ApiOperation({
		summary: 'React post by post Id',
	})
	reactPost(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: CreateReactionDto,
	) {
		return { id, input };
	}

	//SHARE POST
	@Public()
	@Post(':id/share')
	@ApiOperation({
		summary: 'Share post by post Id',
	})
	sharePost(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: SharePostDto,
	) {
		//TODO: add request userId
		return { id, input };
	}

	//BOOKMARK
	@Public()
	@Post(':id/bookmark')
	@ApiOperation({
		summary: 'Bookmark Post by post Id',
	})
	bookmarkPost(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: CreateBookmarkPostDto,
	) {
		//TODO: add request userId
		return { id, input };
	}
}
