import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { BookmarkSubscriber } from './bookmarks.subscriber';
import { BookmarkPostsModule } from '../bookmark_posts/bookmark_posts.module';

@Module({
	imports: [TypeOrmModule.forFeature([Bookmark]), BookmarkPostsModule],
	controllers: [BookmarksController],
	providers: [BookmarksService, BookmarkSubscriber],
	exports: [BookmarksService],
})
export class BookmarksModule {}
