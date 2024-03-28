import { Module, forwardRef } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { PostsModule } from '../posts/posts.module';
import { VibloScrapingService } from './viblo/viblo-scraping.service';
import { VnExpressScrapingService } from './vnExpress/vnExpress-scraping.service';
import { SpiderumScrapingService } from './spiderum/spiderum-scraping.service';

@Module({
	imports: [forwardRef(() => PostsModule)],
	providers: [
		ScrapingService,
		VibloScrapingService,
		VnExpressScrapingService,
		SpiderumScrapingService,
	],
	exports: [ScrapingService],
})
export class ScrapingModule {}
