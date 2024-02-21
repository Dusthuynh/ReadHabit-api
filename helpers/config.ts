import { diskStorage } from 'multer';

export const storageConfig = (folder: string) =>
	diskStorage({
		destination: `files/${folder}`,
		filename: (req, file, cb) => {
			const name = file.originalname.split('.')[0];
			const fileExtension = file.originalname.split('.')[1];
			const newFileName =
				name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
			cb(null, newFileName);
		},
	});
