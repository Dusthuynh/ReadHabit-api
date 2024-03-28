import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Req,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { UploadPhotoDto } from 'src/shared/dto/upload-photo.dto';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserPayload } from 'src/shared/interfaces/current-user.interface';
import { ESortField, ESortOrder } from 'src/shared/enum/sort.enum';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Public } from '../auth/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AddCategoryDto } from './dto/add-category.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
	constructor(
		private readonly userService: UsersService,
		private readonly configService: ConfigService,
	) {}

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: Number, description: 'User ID' })
	async findUserById(@Param('id') id: number) {
		const data = await this.userService.findOneWithRelation({
			where: { id },
			relations: { categories: true },
		});
		if (!data) {
			throw new BadRequestException('user not found');
		}
		return data;
	}

	@Public()
	@Get()
	@ApiResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					total: 0,
					filter: {
						limit: 10,
						offset: 0,
						searchField: 'string',
						searchValue: 'string',
						sortField: ESortField.CREATED_AT,
						sortOrder: ESortOrder.ASC,
					} as GetUserDto,
					data: [
						{
							id: 1,
							username: 'string',
							email: 'string',
							createdAt: new Date(),
							updatedAt: new Date(),
							avatar: '',
						},
					] as User[],
				},
			} as SuccessResponse<User[], GetUserDto>,
		},
		status: 200,
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllUsers(@Query() filter: GetUserDto) {
		return this.userService.findAll(filter);
	}

	@ApiBearerAuth()
	@Post()
	@ApiOperation({
		summary: 'Create One User',
		deprecated: true,
	})
	@ApiBody({
		type: CreateUserDto,
		examples: {
			ADMIN: {
				summary: 'Admin',
				value: {
					username: 'Admin user',
					email: 'admin@test.com',
					password: '123123123123',
				} as CreateUserDto,
			},
			USER: {
				summary: 'User',
				value: {
					username: 'User',
					email: 'user@test.com',
					password: '123123123123',
				} as CreateUserDto,
			},
		},
	})
	createUser(@Body() input: CreateUserDto) {
		//TODO: register user => update user
		return this.userService.createOne(input);
	}

	@ApiBearerAuth()
	@Patch(':id')
	@ApiParam({
		name: 'id',
		type: Number,
		description: 'User ID',
		example: 1,
	})
	async updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto,
		@CurrentUser() user: CurrentUserPayload,
	) {
		return await this.userService.updateUser(id, user, updateUserDto);
		// return this.userService.updateOne({ id }, updateUserDto);
	}

	@ApiBearerAuth()
	@Delete(':id')
	@ApiParam({ name: 'id', type: Number, description: 'User ID' })
	deleteUser(@Param('id', ParseIntPipe) id: number) {
		//TODO: Before delete user, check the related
		return this.userService.deleteOne({ id });
	}

	@ApiBearerAuth()
	@Post('upload-avatar')
	@ApiBearerAuth()
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('avatar', {
			storage: storageConfig('avatar'),
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
	@ApiBody({ type: UploadPhotoDto })
	async uploadPhoto(
		@CurrentUser() user: CurrentUserPayload,
		@Req() req: any,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (req.fileValidationError) {
			throw new BadRequestException(req.fileValidationError);
		}

		if (!file) {
			throw new BadRequestException('File is required');
		}

		return this.userService.uploadAvatar(user.uid, file.path);
	}

	//CATEGORIES
	@ApiBearerAuth()
	@Post(':id/categories')
	@ApiOperation({ summary: "Set user's categories" })
	async addCategories(
		@Param('id', ParseIntPipe) id: number,
		@Body() input: AddCategoryDto,
	) {
		return await this.userService.addCategories(id, input);
	}
}
