import { Category } from 'src/modules/categories/entities/category.entity';

type ICategory = Partial<Category>;
export const categoryData: ICategory[] = [
	{ id: 1, name: 'Quan điểm' },
	{ id: 2, name: 'Khoa học - Công nghệ' },
	{ id: 3, name: 'Ô tô' },
	{ id: 4, name: 'Life style' },
	{ id: 5, name: 'Giáo dục' },
	{ id: 6, name: 'Nông nghiệp' },
	{ id: 7, name: 'Kinh tế' },
];
