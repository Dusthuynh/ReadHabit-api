import { User } from 'src/modules/users/entities/user.entity';
import { USER_ROLE } from 'src/shared/enum/user.enum';

type IUser = Partial<User>;
export const userData: IUser[] = [
	{
		id: 1,
		email: 'dust.admin@rh.com',
		username: 'dust.admin',
		birthday: new Date(),
		phoneNumber: '0853674782',
		firstName: 'Nghĩa',
		lastName: 'Huỳnh Minh',
		password:
			'907bb01dbbec472900343c88f06d9a11d26f91c97e1eeeae060580c9e33135b287ed8d57db8b1eef69dcbd318687e184c596d1d99ed2dfa1da54426e30a4ae22.dbf0ff59fe438de00fed495965d0ba8c',
		avatar: 'files/avatar/dust.admin.jpg',
		role: USER_ROLE.ADMIN,
	},
	{
		id: 2,
		email: 'loc.admin@rh.com',
		birthday: new Date(),
		phoneNumber: '0853674785',
		firstName: 'Lộc',
		lastName: 'Huỳnh Hữu',
		username: 'loc.admin',
		password:
			'907bb01dbbec472900343c88f06d9a11d26f91c97e1eeeae060580c9e33135b287ed8d57db8b1eef69dcbd318687e184c596d1d99ed2dfa1da54426e30a4ae22.dbf0ff59fe438de00fed495965d0ba8c',
		avatar: 'files/avatar/loc.admin.jpg',
		role: USER_ROLE.ADMIN,
	},
	{
		id: 3,
		email: 'thaiha@rh.com',
		birthday: new Date(),
		phoneNumber: '0853674786',
		firstName: 'Hà',
		lastName: 'Vũ Thái',
		username: 'thaiha',
		password:
			'907bb01dbbec472900343c88f06d9a11d26f91c97e1eeeae060580c9e33135b287ed8d57db8b1eef69dcbd318687e184c596d1d99ed2dfa1da54426e30a4ae22.dbf0ff59fe438de00fed495965d0ba8c',
		avatar: 'files/avatar/thaiha.jpg',
		role: USER_ROLE.MEMBER,
	},
	{
		id: 4,
		email: 'phuhien@rh.com',
		birthday: new Date(),
		phoneNumber: '0853674787',
		firstName: 'Hiển',
		lastName: 'Nguyễn Phú',
		username: 'phuhien',
		password:
			'907bb01dbbec472900343c88f06d9a11d26f91c97e1eeeae060580c9e33135b287ed8d57db8b1eef69dcbd318687e184c596d1d99ed2dfa1da54426e30a4ae22.dbf0ff59fe438de00fed495965d0ba8c',
		avatar: 'files/avatar/phuhien.jpg',
		role: USER_ROLE.MEMBER,
	},
	{
		id: 5,
		email: 'hongan@rh.com',
		username: 'hongan',

		birthday: new Date(),
		phoneNumber: '0853674788',
		firstName: 'Ân',
		lastName: 'Nguyễn Trần Hồng',
		password:
			'907bb01dbbec472900343c88f06d9a11d26f91c97e1eeeae060580c9e33135b287ed8d57db8b1eef69dcbd318687e184c596d1d99ed2dfa1da54426e30a4ae22.dbf0ff59fe438de00fed495965d0ba8c',
		avatar: 'files/avatar/hongan.jpeg',
		role: USER_ROLE.MEMBER,
	},
	{
		id: 6,
		email: 'phuminh@rh.com',
		birthday: new Date(),
		phoneNumber: '0853674789',
		firstName: 'Phú',
		lastName: 'Triệu Minh',
		username: 'phuminh',
		password:
			'907bb01dbbec472900343c88f06d9a11d26f91c97e1eeeae060580c9e33135b287ed8d57db8b1eef69dcbd318687e184c596d1d99ed2dfa1da54426e30a4ae22.dbf0ff59fe438de00fed495965d0ba8c',
		avatar: 'files/avatar/phuminh.jpg',
		role: USER_ROLE.MEMBER,
	},
];
