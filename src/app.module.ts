import { Module } from '@nestjs/common';
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
import { SharePostsModule } from './modules/share_posts/share_posts.module';
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
		AuthModule,
		UsersModule,
		PostsModule,
		ContentSourcesModule,
		CategoriesModule,
		CommentsModule,
		TagsModule,
		SharePostsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
