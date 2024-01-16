import { Category } from 'src/modules/categories/entities/category.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { ContentSource } from 'src/modules/content_sources/entities/content_source.entity';
import { Tag } from 'src/modules/tags/entities/tag.entities';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { POST_STATUS, POST_TYPE } from 'src/shared/enum/post.enum';
import {
	Column,
	Entity,
	ManyToOne,
	Index,
	OneToMany,
	ManyToMany,
} from 'typeorm';

@Entity()
@Index(['createdById', 'contentSourceId'])
export class Post extends BaseObject {
	@Column()
	title: string;

	@Column()
	content: string;

	@Column()
	description: string;

	@Column()
	publishDate: Date;

	@Column({ type: 'enum', enum: POST_STATUS })
	status: POST_STATUS;

	@Column({ type: 'enum', enum: POST_TYPE })
	type: POST_TYPE;

	@Column()
	readTime: number;

	@Column()
	totalLike: number;

	@Column()
	totalDislike: number;

	@Column()
	totalShare: number;

	@Column()
	categoryId: number;

	@Column({ nullable: true })
	createdById: number;

	@Column({ nullable: true })
	contentSourceId: number;

	@ManyToOne(() => Category, (category: Category) => category.posts)
	category: Category;

	@ManyToOne(() => User)
	createdBy: User;

	@ManyToOne(() => ContentSource)
	contentSource: ContentSource;

	@OneToMany(() => Comment, (comment: Comment) => comment.post)
	comments: Comment[];

	@ManyToMany(() => Tag, (tag: Tag) => tag)
	tags: Tag[];
}
