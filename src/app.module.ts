import { EventEmitterModule } from '@nestjs/event-emitter';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './app.config';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { PostsModule } from './modules/posts/posts.module';
import { ContentSourcesModule } from './modules/content_sources/content_sources.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TagsModule } from './modules/tags/tags.module';
import { FollowsModule } from './modules/follows/follows.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RanksModule } from './modules/ranks/ranks.module';
import { RankLevelsModule } from './modules/rank_levels/rank_levels.module';
import { FeedbackModule } from './modules/feedbacks/feedbacks.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { BookmarkPostsModule } from './modules/bookmark_posts/bookmark_posts.module';
import { EventLogsModule } from './modules/event_logs/event_logs.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './exception-filters/global-exception.filter';
import { AppLoggerMiddleware } from './interceptors/logging.interceptor';
import { JwtAccessTokenAuthGuard } from './modules/auth/guards/jwt-access-token-auth.guard';
import { ReactionsModule } from './modules/reactions/reactions.module';
import { ScrapingModule } from './modules/scraping/scraping.module';
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) => {
				return {
					host: configService.get('POSTGRES_HOST'),
					port: configService.get('POSTGRES_PORT') as unknown as number,
					username: configService.get('POSTGRES_USER'),
					password: configService.get('POSTGRES_PASSWORD'),
					database: process.env.POSTGRES_DB,
					synchronize: true,
					type: 'postgres',
					autoLoadEntities: true,
				};
			},
			inject: [ConfigService],
		}),
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		BullModule.forRoot({
			redis: {
				host: appConfig.redis.host,
				port: appConfig.redis.port,
			},
		}),
		CacheModule.registerAsync<any>({
			isGlobal: true,
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const store = await redisStore({
					url: `redis://${configService.get('REDIS_HOST')}:${configService.get(
						'REDIS_PORT',
					)}`,
				});
				return {
					store: () => store,
				};
			},
			inject: [ConfigService],
		}),
		EventEmitterModule.forRoot({
			wildcard: true,
		}),
		AuthModule,
		UsersModule,
		PostsModule,
		ContentSourcesModule,
		CategoriesModule,
		CommentsModule,
		TagsModule,
		FollowsModule,
		NotificationsModule,
		RanksModule,
		RankLevelsModule,
		FeedbackModule,
		BookmarksModule,
		BookmarkPostsModule,
		EventLogsModule,
		ReactionsModule,
		ScrapingModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAccessTokenAuthGuard,
		},
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}

	constructor() {
		console.log({ appConfig });
	}
}
