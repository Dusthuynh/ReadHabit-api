import { Category } from 'src/modules/categories/entities/category.entity';
import {
	Column,
	Entity,
	ManyToOne,
	CreateDateColumn,
	PrimaryColumn,
} from 'typeorm';

@Entity()
export class Tag {
	@PrimaryColumn()
	id: string;

	@Column({ nullable: true })
	name: string;

	@Column()
	categoryId: number;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => Category)
	category: Category;
}
