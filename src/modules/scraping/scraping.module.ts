import { Module, forwardRef } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { PostsModule } from '../posts/posts.module';
import { VibloScrapingService } from './content-source/viblo/viblo-scraping.service';
import { VnExpressScrapingService } from './content-source/vnExpress/vnExpress-scraping.service';
import { SpiderumScrapingService } from './content-source/spiderum/spiderum-scraping.service';
import { ScrapingController } from './scraping.controller';

@Module({
	imports: [PostsModule],
	controllers: [ScrapingController],
	providers: [
		ScrapingService,
		VibloScrapingService,
		VnExpressScrapingService,
		SpiderumScrapingService,
	],
	exports: [ScrapingService],
})
export class ScrapingModule {}
