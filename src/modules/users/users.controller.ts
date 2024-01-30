import {
	BadRequestException,
	Controller,
	Get,
	Post,
	Req,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { UploadPhotoDto } from 'src/shared/dto/upload-photo.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
	@Public()
	@Get('')
	getListUsers() {
		return 'get list user';
	}

	@Public()
	@Get(':id')
	getUser() {
		return 'get user by id';
	}

	@Post('upload-avatar')
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
		@Req() req: any,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (req.fileValidationError) {
			throw new BadRequestException(req.fileValidationError);
		}

		if (!file) {
			throw new BadRequestException('File is required');
		}
		console.log(file);
	}
}
