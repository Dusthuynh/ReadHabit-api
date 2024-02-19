import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { Public } from '../auth/utils';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTagDto } from './dto/get-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
@ApiTags('tags')
export class TagsController {
	@Public()
	@Get('')
	@ApiOperation({
		summary: 'Get Many Tags',
	})
	getManyCategory(@Query() filter: GetTagDto) {
		return filter;
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Tag By Id',
	})
	findUserById(@Param('id', ParseIntPipe) id: number) {
		return id;
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create Tags',
	})
	createTags(@Body() input: CreateTagDto) {
		return input;
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update Tag by Id',
	})
	UpdateTag(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: UpdateTagDto,
	) {
		return { id, input };
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Tag By Id',
	})
	deleteTag(@Param('id', ParseIntPipe) id: number) {
		//TODO: Before delete tag, check the related
		return id;
	}
}
