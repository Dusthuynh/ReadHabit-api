import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetRankDto } from './dto/get-rank.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RankService } from './ranks.service';

@Controller('rank')
@ApiTags('rank')
export class RankController {
	constructor(private readonly rankService: RankService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Rank',
	})
	async getManyEventLog(@Query() filter: GetRankDto) {
		return await this.rankService.getManyEventLog(filter);
	}

	@Get('me')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get my current rank',
	})
	async getMyCurrentRank(@CurrentUser('uid') userId: number) {
		const data = await this.rankService.findOneWithRelation({
			where: { isLock: false, ownerId: userId },
			relations: { rankLevel: true, owner: true },
		});
		if (!data) {
			throw new BadRequestException('Not found current rank');
		}
		return data;
	}
}
