import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { GetBookmarkDto } from './dto/get-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { EventEmitter } from 'events';
import { CreateBookmarkPostDto } from '../bookmark_posts/dto/create-bookmark-post.dto';
import { BookmarkPostsService } from '../bookmark_posts/bookmark_posts.service';
import { UpdateBookmarkPostPositionDto } from '../bookmark_posts/dto/update-boomark-post-position.dto';
import { Post } from '../posts/entities/post.entity';
export const bookmarkEmitter = new EventEmitter();
@Injectable()
export class BookmarksService extends BaseService<Bookmark> {
	constructor(
		@InjectRepository(Bookmark)
		private bookmarkRepository: Repository<Bookmark>,
		private bookmarkPostService: BookmarkPostsService,
	) {
		super(bookmarkRepository);
	}

	async getManyBookmark(filter: GetBookmarkDto) {
		const { limit, offset, ...condition } = filter;
		const where = {};
		if (filter.ownerId) {
			where['ownerId'] = filter.ownerId;
		}

		const order = {};
		order['position'] = 'asc';

		const [count, data] = await Promise.all([
			this.bookmarkRepository.count({
				where,
			}),
			this.bookmarkRepository.find({
				where,
				order,
				//NOTE: limit 100 rows
				take: limit ? (limit <= 100 ? limit : 100) : 10,
				skip: offset ? offset : 0,
				relations: { bookmarkPosts: { createdBy: true } },
			}),
		]);

		return {
			filter: filter,
			total: count,
			data,
		};
	}

	async getMyManyBookmark(userId: number) {
		const [count, data] = await Promise.all([
			this.bookmarkRepository.count({
				where: { ownerId: userId },
			}),
			this.bookmarkRepository.find({
				where: { ownerId: userId },
				order: { position: 'ASC' },
				relations: { bookmarkPosts: { createdBy: true } },
			}),
		]);

		return {
			total: count,
			data,
		};
	}

	async createBookmark(userId: number, input: CreateBookmarkDto) {
		const maxPositionBookmark = await this.bookmarkRepository
			.createQueryBuilder('bookmark')
			.where('bookmark.ownerId = :userId', { userId })
			.orderBy('bookmark.position', 'DESC')
			.getOne();

		const maxPosition = maxPositionBookmark ? maxPositionBookmark.position : 0;

		const existingBookmark = await this.bookmarkRepository.findOne({
			where: { ownerId: userId, name: input.name },
		});

		if (existingBookmark) {
			throw new BadRequestException('Bookmark name already exists!');
		}

		const newBookmark = this.bookmarkRepository.create({
			name: input.name,
			ownerId: userId,
			position: maxPosition + 1,
		});

		return await this.bookmarkRepository.save(newBookmark);
	}

	async updateBookmark(
		bookmarkId: number,
		userId: number,
		input: UpdateBookmarkDto,
	) {
		const bookmark = await this.findOne({ id: bookmarkId, ownerId: userId });
		if (bookmark.position === 0) {
			throw new BadRequestException('Unable to edit default bookmark!');
		}

		if (input.position) {
			if (input.position === 0) {
				throw new BadRequestException(
					'Unable to change position with default bookmark.',
				);
			} else {
				const anotherbookmark = await this.bookmarkRepository.findOne({
					where: { ownerId: userId, position: input.position },
				});
				if (!anotherbookmark) {
					throw new BadRequestException('Bookmark not found!');
				}

				const position = bookmark.position;
				bookmark.position = anotherbookmark.position;
				anotherbookmark.position = position;
				await this.bookmarkRepository.save([bookmark, anotherbookmark]);
			}
		}

		if (input.name) {
			bookmark.name = input.name;
			await this.bookmarkRepository.save(bookmark);
		}

		return bookmark;
	}

	async deleteBookmark(bookmarkId: number, userId: number) {
		const bookmark = await this.findOne({ id: bookmarkId, ownerId: userId });
		if (bookmark.position === 0) {
			throw new BadRequestException('Unable to delete default bookmark!');
		}
		const res = await this.bookmarkRepository.remove(bookmark, {
			data: { bookmark },
		});

		if (res) {
			return { success: true };
		} else {
			return { success: false };
		}
	}

	async createBookmarkPost(
		userId: number,
		input: CreateBookmarkPostDto,
		post: Post,
	) {
		const bookmark = await this.findOne({ id: input.bookmarkId });
		if (bookmark.ownerId !== userId) {
			throw new BadRequestException('No permission to create bookmarked post.');
		}

		return await this.bookmarkPostService.createBookmarkPost(input, post);
	}

	async updateBookmarkPostPosition(
		bookmarkId: number,
		userId: number,
		input: UpdateBookmarkPostPositionDto,
	) {
		const bookmark = await this.findOne({ id: bookmarkId });
		if (bookmark.ownerId !== userId) {
			throw new BadRequestException('No permission to update bookmarked post.');
		}

		return await this.bookmarkPostService.updateBookmarkPostPosition(
			bookmarkId,
			input,
		);
	}

	async deleteBookmarkPost(
		bookmarkId: number,
		bookmarkPostId: number,
		userId: number,
	) {
		const bookmark = await this.findOne({ id: bookmarkId });
		if (bookmark.ownerId !== userId) {
			throw new BadRequestException('No permission to update bookmarked post.');
		}
		return await this.bookmarkPostService.deleteBookmarkPost(
			bookmarkId,
			bookmarkPostId,
		);
	}
}
