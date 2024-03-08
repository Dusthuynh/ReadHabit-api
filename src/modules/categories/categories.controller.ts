import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { deleteFile, storageConfig } from 'helpers/config';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserPayload } from 'src/shared/interfaces/current-user.interface';
import { USER_ROLE } from 'src/shared/enum/user.enum';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
	constructor(private readonly categoryService: CategoriesService) {}

	@Public()
	@Get('')
	@ApiOperation({
		summary: 'Get Many Category',
	})
	async getManyCategory(@Query() filter: DefaultListDto) {
		return await this.categoryService.findMany(filter);
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Category By Id',
	})
	async findCategoryById(@Param('id', ParseIntPipe) id: number) {
		return await this.categoryService.findOne({ id });
	}

	@ApiBearerAuth()
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
	async createCategory(
		@UploadedFile() categoryImage: Express.Multer.File,
		@Body() input: CreateCategoryDto,
	) {
		input.imageURL = categoryImage ? categoryImage.path : null;
		return await this.categoryService.createCategory(input);
	}

	@ApiBearerAuth()
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
	async updateCategoryById(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile()
		categoryImage: Express.Multer.File,
		@Body() input: UpdateCategoryDto,
	) {
		input.imageURL = categoryImage ? categoryImage.path : null;
		return await this.categoryService.updateCategoryById(id, input);
	}

	@ApiBearerAuth()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Category By Id',
	})
	async deleteCategory(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: CurrentUserPayload,
	) {
		if (user.role !== USER_ROLE.ADMIN) {
			throw new ForbiddenException(
				'Do not have permission to delete this category',
			);
		}
		return await this.categoryService.deleteOne({ id });
	}
}
