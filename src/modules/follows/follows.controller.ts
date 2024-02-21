import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetFollowDto } from './dto/get-follow.dto';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UnfollowDto } from './dto/unfollow.dto';

@Controller('follows')
@ApiTags('follows')
export class FollowsController {
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get Many Follow',
	})
	getManyFollow(@Query() filter: GetFollowDto) {
		return filter;
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Follow user',
	})
	followUser(@Body() input: CreateFollowDto) {
		return input;
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Unfollow user',
	})
	unfollowUser(@Body() input: UnfollowDto) {
		return input;
	}
}
