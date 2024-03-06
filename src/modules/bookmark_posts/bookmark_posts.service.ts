import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { BookmarkPost } from './entities/bookmark_post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookmarkPostDto } from './dto/create-bookmark-post.dto';
import { UpdateBookmarkPostPositionDto } from './dto/update-boomark-post-position.dto';

@Injectable()
export class BookmarkPostsService extends BaseService<BookmarkPost> {
	constructor(
		@InjectRepository(BookmarkPost)
		private bookmarkPostRepository: Repository<BookmarkPost>,
	) {
		super(bookmarkPostRepository);
	}

	async createBookmarkPost(input: CreateBookmarkPostDto) {
		const itemExists = await this.bookmarkPostRepository.findOne({
			where: { bookmarkId: input.bookmarkId, postId: input.postId },
		});
		if (itemExists) {
			throw new BadRequestException('The post already exists in the bookmarks');
		}

		const maxPositionBP = (
			await this.bookmarkPostRepository.find({
				where: { bookmarkId: input.bookmarkId },
				order: { position: 'DESC' },
				take: 1,
			})
		)[0];
		input.position = maxPositionBP ? maxPositionBP.position + 1 : 0;

		const newBookmarkPost = this.bookmarkPostRepository.create(input);
		return await this.bookmarkPostRepository.save(newBookmarkPost);
	}

	async updateBookmarkPostPosition(
		bookmarkId: number,
		input: UpdateBookmarkPostPositionDto,
	) {
		const [bookmarkPost1, bookmarkPost2] = await Promise.all([
			this.findOne({
				bookmarkId,
				position: input.position1,
			}),
			this.findOne({
				bookmarkId,
				position: input.position2,
			}),
		]);
		const position = bookmarkPost1.position;
		bookmarkPost1.position = bookmarkPost2.position;
		bookmarkPost2.position = position;

		return await this.bookmarkPostRepository.save([
			bookmarkPost1,
			bookmarkPost2,
		]);
	}

	async deleteBookmarkPost(bookmarkId: number, bookmarkPostId: number) {
		const bookmarkPost = await this.findOne({
			id: bookmarkPostId,
			bookmarkId,
		});

		const res = await this.bookmarkPostRepository.remove(bookmarkPost, {
			data: { bookmarkPost },
		});

		if (res) {
			return { success: true };
		} else {
			return { success: false };
		}
	}
}
