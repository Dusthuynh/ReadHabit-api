import { Module } from '@nestjs/common';
import { SharePostsController } from './share_posts.controller';
import { SharePostsService } from './share_posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharePost } from './entities/share_post.entity';

@Module({
	imports: [TypeOrmModule.forFeature([SharePost])],
	controllers: [SharePostsController],
	providers: [SharePostsService],
	exports: [SharePostsService],
})
export class SharePostsModule {}
