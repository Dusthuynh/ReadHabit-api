import { Module } from '@nestjs/common';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Follow])],
	controllers: [FollowsController],
	providers: [FollowsService],
	exports: [FollowsService],
})
export class FollowsModule {}
