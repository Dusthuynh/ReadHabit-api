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
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { CreateContentSourceDto } from './dto/create-content-source.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { UpdateContentSourceDto } from './dto/update-content-source.dto';

@Controller('content-sources')
@ApiTags('content-sources')
export class ContentSourcesController {
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get Many Content source',
	})
	getManyContentSource(@Query() filter: DefaultListDto) {
		return filter;
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Content source By Id',
	})
	findContentSourceById(@Param('id', ParseIntPipe) id: number) {
		return id;
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create Content source',
	})
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('contentSourceImage', {
			storage: storageConfig('content_source'),
			fileFilter(req, file, cb) {
				if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
					req.fileValidationError =
						'Wrong extension type. Accepted file ext are: jpg|jpeg|png';
					cb(null, false);
				} else {
					const fileSize = parseInt(req.headers['content-length']);
					if (fileSize > 1024 * 1024 * 5) {
						req.fileValidationError =
							'File size is too large. Accepted file size is less than 5MB';
						cb(null, false);
					} else {
						cb(null, true);
					}
				}
			},
		}),
	)
	createContentSource(
		@UploadedFile() contentSourceImage: Express.Multer.File,
		@Body() input: CreateContentSourceDto,
	) {
		//TODO: add request userId
		return { input, contentSourceImage };
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update Content source By Id',
	})
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('contentSourceImage', {
			storage: storageConfig('content_source'),
			fileFilter(req, file, cb) {
				if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
					req.fileValidationError =
						'Wrong extension type. Accepted file ext are: jpg|jpeg|png';
					cb(null, false);
				} else {
					const fileSize = parseInt(req.headers['content-length']);
					if (fileSize > 1024 * 1024 * 5) {
						req.fileValidationError =
							'File size is too large. Accepted file size is less than 5MB';
						cb(null, false);
					} else {
						cb(null, true);
					}
				}
			},
		}),
	)
	updateContentSourceById(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile()
		contentSourceImage: Express.Multer.File,
		@Body() input: UpdateContentSourceDto,
	) {
		return { id, contentSourceImage, input };
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Content source By Id',
	})
	deleteContentSource(@Param('id', ParseIntPipe) id: number) {
		//TODO: Before delete category, check the related
		return id;
	}
}
