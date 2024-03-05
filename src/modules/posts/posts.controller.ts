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
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
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
import { PostsService } from './posts.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
	constructor(private readonly postService: PostsService) {}

	@Public()
	@Get('')
	@ApiOperation({
		summary: 'Get many Post',
	})
	async getManyPost(@Query() filter: GetPostDto) {
		return await this.postService.getManyPost(filter);
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Post by Id',
	})
	async findPostById(@Param('id', ParseIntPipe) id: number) {
		return await this.postService.findOneWithRelation({
			where: { id },
			relations: {
				comments: true,
				tags: true,
				contentSource: true,
				category: true,
				createdBy: true,
			},
		});
	}

	@ApiBearerAuth()
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
	async createPost(
		@Body() input: CreatePostDto,
		@UploadedFile() postImage: Express.Multer.File,
		@CurrentUser('uid') userId: number,
	) {
		input.imageURL = postImage ? postImage.path : null;
		return await this.postService.createPost(userId, input);
	}

	@ApiBearerAuth()
	@Post(':id/review')
	async reviewPost(
		@Body() input: ReviewPostDto,
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('uid') userId: number,
	) {
		return await this.postService.reviewPost(id, userId, input);
	}

	@ApiBearerAuth()
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
	async updatePost(
		@UploadedFile() postImage: Express.Multer.File,
		@Body() input: UpdatePostDto,
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('uid') userId: number,
	) {
		input.imageURL = postImage ? postImage.path : null;
		return await this.postService.updatePost(id, userId, input);
	}

	@ApiBearerAuth()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Post by Id',
	})
	async deletePost(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('uid') userId: number,
	) {
		//TODO: Before delete post, check the related
		return await this.postService.deletePost(id, userId);
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
	@ApiBearerAuth()
	@Post(':id/react')
	@ApiOperation({
		summary: 'React post by post Id',
	})
	async reactPost(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: CreateReactionDto,
		@CurrentUser('uid') userId: number,
	) {
		input.userId = userId;
		input.postId = id;
		return await this.postService.reactPost(input);
	}

	//SHARE POST
	@ApiBearerAuth()
	@Post(':id/share')
	@ApiOperation({
		summary: 'Share post by post Id',
	})
	async sharePost(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: SharePostDto,
		@CurrentUser('uid') userId: number,
	) {
		return await this.postService.sharePost(id, userId, input);
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
