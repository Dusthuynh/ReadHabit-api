import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BullModule } from '@nestjs/bull';
import { CategoriesModule } from '../categories/categories.module';
import { UserSubscriber } from './users.subscriber';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		BullModule.registerQueue({
			name: 'user_queue',
		}),
		CategoriesModule,
	],
	controllers: [UsersController],
	providers: [UsersService, UserSubscriber],
	exports: [UsersService],
})
export class UsersModule {}
