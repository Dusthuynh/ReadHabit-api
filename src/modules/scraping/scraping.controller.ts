import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScrapingService } from './scraping.service';
import { QuickGeneratePostDto } from './dto/quick-generate-post.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserPayload } from 'src/shared/interfaces/current-user.interface';

@Controller('scraping')
@ApiTags('scraping')
export class ScrapingController {
	constructor(private readonly scrapingService: ScrapingService) {}

	@ApiBearerAuth()
	@Post('quick-generate')
	@ApiOperation({
		summary: 'Quick generate post',
	})
	async quickGeneratePost(
		@Body() input: QuickGeneratePostDto,
		@CurrentUser() user: CurrentUserPayload,
	) {
		return await this.scrapingService.quickGeneratePost(user, input);
	}
}
