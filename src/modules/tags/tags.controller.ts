import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { Public } from '../auth/utils';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTagDto } from './dto/get-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('tags')
@ApiTags('tags')
export class TagsController {
	constructor(private readonly tagService: TagsService) {}

	@Public()
	@Get('')
	@ApiOperation({
		summary: 'Get Many Tags',
	})
	async getManyTag(@Query() filter: GetTagDto) {
		return await this.tagService.findManyTag(filter);
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Tag By Id',
	})
	async findTagById(@Param('id', ParseIntPipe) id: number) {
		const data = await this.tagService.findOneWithRelation({
			where: { id },
			relations: { posts: true },
		});
		if (!data) {
			throw new NotFoundException('Tag not found!');
		}

		return data;
	}

	@ApiBearerAuth()
	@Post()
	@ApiOperation({
		summary: 'Create Tags',
	})
	async createTags(
		@CurrentUser('uid') userId: number,
		@Body() input: CreateTagDto,
	) {
		return await this.tagService.createTags(userId, input);
	}

	@ApiBearerAuth()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update Tag by Id',
	})
	async UpdateTag(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: UpdateTagDto,
	) {
		return await this.tagService.updateOne({ id }, input);
	}

	@ApiBearerAuth()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Tag By Id',
	})
	async deleteTag(@Param('id', ParseIntPipe) id: number) {
		//TODO: Before delete tag, check the related
		return await this.tagService.deleteOne({ id });
	}
}
