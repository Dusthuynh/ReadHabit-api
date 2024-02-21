import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetRankDto } from './dto/get-rank.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('rank')
@ApiTags('rank')
export class RankController {
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Rank',
	})
	getManyEventLog(@Query() filter: GetRankDto) {
		return filter;
	}

	@Get('me')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get my current rank',
	})
	getMyCurrentRank(@CurrentUser('uid') userId: number) {
		return userId;
	}
}
