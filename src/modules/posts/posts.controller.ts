import { EventEmitter2 } from '@nestjs/event-emitter';
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
import { EVENT_ACTION } from 'src/shared/enum/event.enum';
import { PostEvent } from '../event_logs/events/post.event';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
	constructor(
		private readonly postService: PostsService,
		private eventEmitter: EventEmitter2,
	) {}

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
				tags: true,
				contentSource: true,
				category: true,
				createdBy: true,
				sharePost: true,
				sharedByPosts: true,
				comments: true,
				reactions: true,
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
		const data = await this.postService.createPost(userId, input);
		this.eventEmitter.emit(`post.${EVENT_ACTION.CREATE}`, {
			postId: data.id,
			actorId: userId,
			action: EVENT_ACTION.CREATE,
		} as PostEvent);
		return data;
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
		return await this.postService.deletePost(id, userId);
	}

	//COMMENTS
	@ApiBearerAuth()
	@Post(':id/comments')
	@ApiOperation({
		summary: 'Create Comment by post Id',
	})
	async commentPost(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('uid') userId: number,
		@Body() input: CreateCommentDto,
	) {
		const data = await this.postService.commentPost(id, userId, input);
		this.eventEmitter.emit(`post.${EVENT_ACTION.COMMENT}`, {
			postId: data.postId,
			actorId: userId,
			action: EVENT_ACTION.COMMENT,
		} as PostEvent);
		return data;
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
		const data = await this.postService.sharePost(id, userId, input);
		this.eventEmitter.emit(`post.${EVENT_ACTION.SHARE}`, {
			postId: data.sharePostId,
			actorId: userId,
			action: EVENT_ACTION.SHARE,
		} as PostEvent);
		return data;
	}

	//BOOKMARK
	@ApiBearerAuth()
	@Post(':id/bookmark')
	@ApiOperation({
		summary: 'Bookmark Post by post Id',
	})
	async createBookmarkPost(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('uid') userId: number,
		@Body() input: CreateBookmarkPostDto,
	) {
		return await this.postService.createBookmarkPost(id, userId, input);
	}
}
