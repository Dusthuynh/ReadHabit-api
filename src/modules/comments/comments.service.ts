import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Like, Not, Raw, Repository, getManager } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentDto } from './dto/get-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService extends BaseService<Comment> {
	constructor(
		@InjectRepository(Comment)
		private commentRepository: Repository<Comment>,
	) {
		super(commentRepository);
	}
	async getManyComment(filter: GetCommentDto) {
		const { limit, offset, ...condition } = filter;
		const where = {};

		where['postId'] = condition.postId;

		if (!condition.path) {
			where['parentId'] = IsNull();
		} else {
			where['path'] = Raw((alias) => `${alias} ~ '^${condition.path}\\d+,$'`);
		}

		const commentRes = await this.commentRepository.find({
			where,
			order: { createdAt: 'asc' },
			take: limit ? (limit <= 100 ? limit : 100) : 10,
			skip: offset ? offset : 0,
			relations: { createdBy: true },
		});

		const includingChildren = JSON.parse(condition.includingChildren);
		if (includingChildren) {
			const allComments = [];
			for (const comment of commentRes) {
				const childComments = await this.commentRepository
					.createQueryBuilder('comment')
					.leftJoinAndSelect('comment.createdBy', 'createdBy')
					.where('comment.path LIKE :path', { path: `${comment.path}%` })
					.andWhere('comment.postId = :postId', { postId: condition.postId })
					.orderBy('comment.createdAt', 'ASC')
					.getMany();

				allComments.push(...childComments);
			}
			return {
				filter,
				total: allComments.length,
				data: allComments,
			};
		}

		return {
			filter,
			total: commentRes.length,
			data: commentRes,
		};
	}

	async createComment(postId: number, userId: number, input: CreateCommentDto) {
		if (input.parentId) {
			const parentComment = await this.findOne({ postId, id: input.parentId });
			if (!parentComment) {
				throw new BadRequestException('Parrent comment not found!');
			}
			const newComment = await this.createOne({
				postId,
				message: input.message,
				createdById: userId,
				parentId: input.parentId,
				path: '',
			});
			newComment.path = parentComment.path
				? parentComment.path + `${newComment.id},`
				: `${newComment.id},`;
			return await this.commentRepository.save(newComment);
		} else {
			const newComment = await this.createOne({
				postId,
				message: input.message,
				createdById: userId,
				path: '',
			});
			newComment.path = `${newComment.id},`;
			return await this.commentRepository.save(newComment);
		}
	}

	async updateComment(
		commentId: number,
		userId: number,
		input: UpdateCommentDto,
	) {
		const comment = await this.findOne({ id: commentId });
		if (comment.createdById !== userId) {
			throw new BadRequestException(
				'Do not have permission to edit this comment.',
			);
		}
		comment.message = input.message;
		return this.commentRepository.save(comment);
	}

	async deleteComment(commentId: number, userId: number) {
		const comment = await this.findOne({ id: commentId });
		//TODO: admin can delete comment
		if (comment.createdById !== userId) {
			throw new BadRequestException(
				'Do not have permission to delete this comment.',
			);
		}
		return await this.deleteMany({ path: Like(`${comment.path}%`) });
	}
}
