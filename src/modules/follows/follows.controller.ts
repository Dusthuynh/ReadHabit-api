import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetFollowDto } from './dto/get-follow.dto';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UnfollowDto } from './dto/unfollow.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FollowsService } from './follows.service';

@Controller('follows')
@ApiTags('follows')
export class FollowsController {
	constructor(private readonly followService: FollowsService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get Many Follow',
	})
	async getManyFollow(@Query() filter: GetFollowDto) {
		return await this.followService.getManyFollow(filter);
	}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Follow user',
	})
	async followUser(
		@Body() input: CreateFollowDto,
		@CurrentUser('uid') userId: number,
	) {
		const followExists = await this.followService.findOneWithoutThrowError({
			followerId: userId,
			followeeId: input.followeeId,
		});
		if (followExists) {
			throw new BadRequestException('This follow already exists');
		}

		return await this.followService.createOne({
			followerId: userId,
			followeeId: input.followeeId,
		});
	}

	@Delete('followeeId/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Unfollow user',
	})
	async unfollowUser(
		@CurrentUser('uid') userId: number,
		@Param('id', ParseIntPipe) id: number,
	) {
		const followExists = await this.followService.findOne({
			followerId: userId,
			followeeId: id,
		});
		return await this.followService.hardDeleteOne({
			id: followExists.id,
		});
	}
}
