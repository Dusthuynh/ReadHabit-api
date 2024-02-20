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
import { CreateCategoryDto } from './dto/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
	@Public()
	@Get('')
	@ApiOperation({
		summary: 'Get Many Category',
	})
	getManyCategory(@Query() filter: DefaultListDto) {
		return filter;
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Category By Id',
	})
	findCategoryById(@Param('id', ParseIntPipe) id: number) {
		return id;
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create Category',
	})
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('categoryImage', {
			storage: storageConfig('category'),
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
	createCategory(
		@UploadedFile() categoryImage: Express.Multer.File,
		@Body() input: CreateCategoryDto,
	) {
		return { input, categoryImage };
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update Category By Id',
	})
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('categoryImage', {
			storage: storageConfig('category'),
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
	updateCategoryById(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile()
		categoryImage: Express.Multer.File,
		@Body() input: UpdateCategoryDto,
	) {
		console.log(id, categoryImage, input);
		return input;
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Category By Id',
	})
	deleteCategory(@Param('id', ParseIntPipe) id: number) {
		//TODO: Before delete category, check the related
		return id;
	}
}
