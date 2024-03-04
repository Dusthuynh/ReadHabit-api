import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from 'src/app.config';
import { Category } from 'src/modules/categories/entities/category.entity';
import { CategorySeeder } from './seeder/category.seeder';
import { Post } from './modules/posts/entities/post.entity';
import { Tag } from './modules/tags/entities/tag.entities';
import { UserSeeder } from './seeder/user.seeder';
import { User } from './modules/users/entities/user.entity';


seeder({
	imports: [
		TypeOrmModule.forRoot({
			...appConfig.postgresConfig,
			type: 'postgres',
			entities: ['dist/src/modules/**/entities/*.entity.js'],
			autoLoadEntities: true
		}),
		TypeOrmModule.forFeature([Category,Post,Tag,User]),
	],
}).run([CategorySeeder,UserSeeder]);
