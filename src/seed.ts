import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from 'src/app.config';
import { Category } from 'src/modules/categories/entities/category.entity';
import { CategorySeeder } from './seeder/category.seeder';
import { Post } from './modules/posts/entities/post.entity';
import { Tag } from './modules/tags/entities/tag.entities';
import { UserSeeder } from './seeder/user.seeder';
import { User } from './modules/users/entities/user.entity';
import { PostSeeder } from './seeder/post.seeder';
import { ContentSourceSeeder } from './seeder/content_sources.seeder';
import { ContentSource } from './modules/content_sources/entities/content_source.entity';
import { TagSeeder } from './seeder/tag.seeder';
import { ReactionSeeder } from './seeder/reaction.seeder';
import { Reaction } from './modules/reactions/entities/reaction.entity';
import { BookmarkSeeder } from './seeder/bookmark.seeder';
import { Bookmark } from './modules/bookmarks/entities/bookmark.entity';
import { BookmarkPost } from './modules/bookmark_posts/entities/bookmark_post.entity';
import { CommentSeeder } from './seeder/comment.seeder';
import { Comment } from './modules/comments/entities/comment.entity';
import { FollowSeeder } from './seeder/follow.seeder';
import { Follow } from './modules/follows/entities/follow.entity';
import { NotificationSeeder } from './seeder/notification.seeder';
import {
	Notification,
	NotificationRecipient,
} from './modules/notifications/entities/notification.entity';
import { FeedbackSeeder } from './seeder/feedback.seeder';
import { Feedback } from './modules/feedbacks/entities/feedback.entity';

seeder({
	imports: [
		TypeOrmModule.forRoot({
			...appConfig.postgresConfig,
			type: 'postgres',
			entities: ['dist/src/modules/**/entities/*.entity.js'],
			autoLoadEntities: true,
		}),
		TypeOrmModule.forFeature([
			Category,
			Post,
			Tag,
			User,
			ContentSource,
			Reaction,
			Bookmark,
			BookmarkPost,
			Comment,
			Follow,
			Notification,
			NotificationRecipient,
			Feedback,
		]),
	],
}).run([
	CategorySeeder,
	UserSeeder,
	ContentSourceSeeder,
	TagSeeder,
	PostSeeder,
	ReactionSeeder,
	CommentSeeder,
	BookmarkSeeder,
	FollowSeeder,
	NotificationSeeder,
	FeedbackSeeder,
]);
