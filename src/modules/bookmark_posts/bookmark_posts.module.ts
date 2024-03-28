import { Module } from '@nestjs/common';
import { BookmarkPostsService } from './bookmark_posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkPost } from './entities/bookmark_post.entity';
import { BookmarkPostSubscriber } from './bookmark_posts.subscriber';

@Module({
	imports: [TypeOrmModule.forFeature([BookmarkPost])],
	providers: [BookmarkPostsService, BookmarkPostSubscriber],
	exports: [BookmarkPostsService],
})
export class BookmarkPostsModule {}
