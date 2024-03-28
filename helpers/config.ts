import { diskStorage } from 'multer';
import * as fs from 'fs-extra';
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

export const deleteFile = async (filePath: string) => {
	try {
		await fs.access(filePath, fs.constants.F_OK);
		await fs.unlink(filePath);
		console.log('File deleted successfully');
	} catch (err) {
		if (err.code !== 'ENOENT') {
			console.error('Unable to delete file:', err);
		}
	}
};
