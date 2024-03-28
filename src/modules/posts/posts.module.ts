import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { ReactionsModule } from '../reactions/reactions.module';
import { PostSubscriber } from './posts.subscriber';
import { CommentsModule } from '../comments/comments.module';
import { BookmarksModule } from '../bookmarks/bookmarks.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Post]),
		TagsModule,
		UsersModule,
		ReactionsModule,
		CommentsModule,
		BookmarksModule,
	],
	controllers: [PostsController],
	providers: [PostsService, PostSubscriber],
	exports: [PostsService],
})
export class PostsModule {}
