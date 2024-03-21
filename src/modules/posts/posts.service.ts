import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { Post } from './entities/post.entity';
import { GetPostDto } from './dto/get-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { TagsService } from '../tags/tags.service';
import { POST_STATUS, POST_TYPE } from 'src/shared/enum/post.enum';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';
import { Tag } from '../tags/entities/tag.entities';
import { CreateReactionDto } from '../reactions/dto/create-reaction.dto';
import { ReactionsService } from '../reactions/reactions.service';
import { ReviewPostDto } from './dto/review-post.dto';
import { STATUS_USER_REVIEW } from 'src/shared/enum/review.enum';
import { USER_ROLE } from 'src/shared/enum/user.enum';
import { SharePostDto } from './dto/share-post.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { CommentsService } from '../comments/comments.service';
import { CreateBookmarkPostDto } from '../bookmark_posts/dto/create-bookmark-post.dto';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { deleteFile } from 'helpers/config';

@Injectable()
export class PostsService extends BaseService<Post> {
	constructor(
		@InjectRepository(Post)
		private postRepository: Repository<Post>,
		private tagService: TagsService,
		private userService: UsersService,
		private reactionService: ReactionsService,
		private commentservice: CommentsService,
		private bookmarkService: BookmarksService,
	) {
		super(postRepository);
	}

	async getManyPost(filter: GetPostDto) {
		const { limit, offset, sortField, sortOrder, ...condition } = filter;
		const where = {};
		if (condition?.searchField && condition?.searchValue) {
			where[condition.searchField] = ILike(`%${condition.searchValue}%`);
		}

		if (filter.categoryId) {
			where['categoryId'] = filter.categoryId;
		}

		if (filter.contentSourceId) {
			where['contentSourceId'] = filter.contentSourceId;
		}

		if (filter.createdById) {
			where['createdById'] = filter.createdById;
		}

		if (filter.tagId) {
			where['tags'] = { id: filter.tagId };
		}

		if (filter.status) {
			where['status'] = In(filter.status);
		}

		if (filter.type) {
			where['type'] = In(filter.type);
		} else {
			filter.type = [
				POST_TYPE.EXTERNAL_PERSONAL_BLOG,
				POST_TYPE.EXTERNAL_POST,
				POST_TYPE.INTERNAL_POST,
			];
			where['type'] = In(filter.type);
		}

		if (filter.sharePostId) {
			where['sharePostId'] = filter.sharePostId;
		}

		if (filter.originalPostURL) {
			where['originalPostURL'] = filter.originalPostURL;
		}

		//TODO: find post by tags
		// if (filter.tagId) {
		// 	where['tagId'] = filter.tagId;
		// }

		const order = {};
		if (sortField && sortOrder) {
			order[sortField] = sortOrder;
		}

		const [count, data] = await Promise.all([
			this.postRepository.count({
				where,
			}),
			this.postRepository.find({
				where,
				order,
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				// relations: [
				// 	'tags',
				// 	'contentSource',
				// 	'category',
				// 	'createdBy',
				// 	'sharedByPosts',
				// 	'sharePost',
				// ],
				relations: { createdBy: true },
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}

	async createPost(userId: number, input: CreatePostDto) {
		const { postImage, tags, ...data } = input;

		if (
			input.status !== POST_STATUS.CREATED &&
			input.status !== POST_STATUS.PUBLISHED
		) {
			throw new BadRequestException('Invalid Post status when create post');
		}

		if (input.originalPostURL) {
			if (input.type === POST_TYPE.INTERNAL_POST)
				throw new BadRequestException(
					'This post type does not have original post URL',
				);
		} else {
			if (input.type !== POST_TYPE.INTERNAL_POST)
				throw new BadRequestException(
					'This post type requires an original post URL',
				);
		}

		//NOTE: create many tags
		const tagArray = tags.split(',');
		const newTags = await this.tagService.createTags(userId, {
			tags: tagArray,
			categoryId: input.categoryId,
		});

		const res = this.postRepository.create(data);
		res.tags = newTags;
		res.createdById = userId;

		return await this.postRepository.save(res);
	}

	async updatePost(postId: number, userId: number, input: UpdatePostDto) {
		const { postImage, tags, categoryId, title, imageURL, ...data } = input;

		const post = await this.postRepository.findOne({ where: { id: postId } });
		const user = await this.userService.findOne({ id: userId });

		//NOTE: Post owner or Admin can edit post
		if (post.createdById !== userId && user.role !== USER_ROLE.ADMIN) {
			throw new BadRequestException(
				'User does not have permission to edit this post.',
			);
		}

		//NOTE: update INTERNAL_SHARE POST
		if (post.type === POST_TYPE.INTERNAL_SHARE) {
			if (!input.title) {
				throw new BadRequestException('The edited content must a title field');
			}
			post.title = input.title;
			return await this.postRepository.save(post);
		}

		if (data.status) {
			if (
				data.status !== POST_STATUS.CREATED &&
				data.status !== POST_STATUS.REVIEWING
			) {
				throw new BadRequestException('Invalid status.');
			}
		}

		//NOTE: Update category, Tag
		if (categoryId) {
			post.categoryId = categoryId;
			post.tags = [];
			await this.postRepository.save(post);
		}
		if (tags) {
			const tagArray = tags.split(',');

			let newTags: Tag[];
			if (categoryId) {
				newTags = await this.tagService.createTags(userId, {
					tags: tagArray,
					categoryId,
				});
			} else {
				newTags = await this.tagService.createTags(userId, {
					tags: tagArray,
					categoryId: post.categoryId,
				});
			}
			post.tags = newTags;
			await this.postRepository.save(post);
		}

		if (title) {
			post.title = title;
			await this.postRepository.save(post);
		}
		if (imageURL) {
			deleteFile(post.imageURL);
			post.imageURL = imageURL;
			await this.postRepository.save(post);
		}

		const res = await this.updateOne({ id: postId }, data);
		return res;
	}

	async deletePost(postId: number, userId: number) {
		const post = await this.postRepository.findOne({ where: { id: postId } });
		const user = await this.userService.findOne({ id: userId });

		//NOTE: Post owner or Admin can delete post
		if (post.createdById !== userId && user.role !== USER_ROLE.ADMIN) {
			throw new BadRequestException(
				'User does not have permission to delete this post.',
			);
		}

		return await this.postRepository.softRemove(post);
	}

	async reactPost(input: CreateReactionDto) {
		const post = await this.postRepository.findOne({
			where: { id: input.postId },
		});

		const reaction = await this.reactionService.findOneWithoutThrowError({
			postId: post.id,
			userId: input.userId,
		});

		if (reaction) {
			if (input.type) {
				if (input.type !== reaction.type) {
					await this.reactionService.hardDeleteOne({
						postId: post.id,
						userId: input.userId,
					});
					await this.reactionService.createOne(input);
				}
			} else {
				await this.reactionService.hardDeleteOne({
					postId: post.id,
					userId: input.userId,
				});
			}
		} else if (!reaction && input.type) {
			await this.reactionService.createOne(input);
		}

		return post;
	}

	async reviewPost(postId: number, userId: number, input: ReviewPostDto) {
		const post = await this.findOne({ id: postId });
		const user = await this.userService.findOne({ id: userId });

		//TODO: check role user (Admin can review)
		if (
			post.status !== POST_STATUS.REVIEWING ||
			user.role !== USER_ROLE.ADMIN
		) {
			throw new BadRequestException('Can not review this post');
		}

		if (input.status === STATUS_USER_REVIEW.CONFIRM) {
			post.status = POST_STATUS.PUBLISHED;
			post.publishDate = new Date();
		} else if (input.status === STATUS_USER_REVIEW.REJECT) {
			post.status = POST_STATUS.REJECT;
		}

		//TODO: create notification when review
		return await this.postRepository.save(post);
	}

	async sharePost(postId: number, userId: number, input: SharePostDto) {
		let post = await this.findOneWithRelation({
			where: { id: postId },
			relations: { sharedByPosts: true },
		});
		if (post.status !== POST_STATUS.PUBLISHED) {
			throw new BadRequestException(
				'The post cannot be shared until it is published.',
			);
		}
		if (post.type === POST_TYPE.INTERNAL_SHARE) {
			post = await this.findOneWithRelation({
				where: { id: post.sharePostId },
				relations: { sharedByPosts: true },
			});
		}
		if (post.createdById === userId) {
			throw new BadRequestException(
				'The post owner cannot share their own post.',
			);
		}

		const newData = new Post();
		newData.createdById = userId;
		newData.title = input.title;
		newData.sharePostId = post.id;
		newData.type = POST_TYPE.INTERNAL_SHARE;
		newData.status = POST_STATUS.PUBLISHED;
		const sharedPost = await this.postRepository.save(newData);

		post.sharedByPosts.push(sharedPost);
		await this.postRepository.save(post);

		return sharedPost;
	}

	async commentPost(postId: number, userId: number, input: CreateCommentDto) {
		const post = await this.postRepository.findOne({ where: { id: postId } });
		if (!post) {
			throw new BadRequestException('Post not found');
		}
		return await this.commentservice.createComment(postId, userId, input);
	}

	async createBookmarkPost(
		postId: number,
		userId: number,
		input: CreateBookmarkPostDto,
	) {
		const post = await this.postRepository.findOne({ where: { id: postId } });
		if (!post) {
			throw new BadRequestException('Post not found');
		}
		input.postId = postId;
		return await this.bookmarkService.createBookmarkPost(userId, input, post);
	}
}
