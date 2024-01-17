import { Module } from '@nestjs/common';
import { BookmarkPostsController } from './bookmark_posts.controller';
import { BookmarkPostsService } from './bookmark_posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkPost } from './entities/bookmark_post.entity';

@Module({
	imports: [TypeOrmModule.forFeature([BookmarkPost])],
	controllers: [BookmarkPostsController],
	providers: [BookmarkPostsService],
	exports: [BookmarkPostsService],
})
export class BookmarkPostsModule {}
