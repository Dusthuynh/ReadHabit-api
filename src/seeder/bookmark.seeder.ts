import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Bookmark } from 'src/modules/bookmarks/entities/bookmark.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BookmarkPost } from 'src/modules/bookmark_posts/entities/bookmark_post.entity';
import { Post } from 'src/modules/posts/entities/post.entity';

type IBookmark = Partial<Bookmark>;

@Injectable()
export class BookmarkSeeder implements Seeder {
	constructor(
		@InjectRepository(Bookmark)
		private BookmarkRepository: Repository<Bookmark>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Post)
		private postRepository: Repository<Post>,
	) {}

	async seed(): Promise<any> {
		const bookmarks: IBookmark[] = [];
		const users = await this.userRepository.find();
		const posts = await this.postRepository.find();
		for (const user of users) {
			const bData = new Bookmark();
			bData.name = 'Yêu thích';
			bData.position = 0;
			bData.ownerId = user.id;

			const bookmarkPosts = [];
			let i = 0;
			const randomPosts = faker.helpers.arrayElements(posts, {
				min: 1,
				max: 20,
			});
			while (i < randomPosts.length - 1) {
				const bPData = new BookmarkPost();
				bPData.title = randomPosts[i].title;
				bPData.imageURL = randomPosts[i].imageURL;
				bPData.postId = randomPosts[i].id;
				bPData.position = i;
				bookmarkPosts.push(bPData);
				i++;
			}
			bData.bookmarkPosts = bookmarkPosts;
			bookmarks.push(bData);
		}

		for (let i = 0; i < 5; i++) {
			for (const user of users) {
				const bData = new Bookmark();
				bData.name = `Đánh dấu ${i + 1}`;
				bData.position = i + 1;
				bData.ownerId = user.id;

				const bookmarkPosts = [];
				let j = 0;
				const randomPosts = faker.helpers.arrayElements(posts, {
					min: 1,
					max: 20,
				});
				while (j < randomPosts.length - 1) {
					const bPData = new BookmarkPost();
					bPData.title = randomPosts[j].title;
					bPData.imageURL = randomPosts[j].imageURL;
					bPData.postId = randomPosts[j].id;
					bPData.position = j;
					bookmarkPosts.push(bPData);
					j++;
				}
				bData.bookmarkPosts = bookmarkPosts;
				bookmarks.push(bData);
			}
		}

		await this.BookmarkRepository.save(bookmarks);
	}

	async drop(): Promise<any> {
		await this.BookmarkRepository.delete({});
	}
}
