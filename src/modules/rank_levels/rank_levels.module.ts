import { Module } from '@nestjs/common';
import { RankLevelsService } from './rank_levels.service';
import { RankLevelsController } from './rank_levels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankLevel } from './entities/rank_level.entity';

@Module({
	imports: [TypeOrmModule.forFeature([RankLevel])],
	controllers: [RankLevelsController],
	providers: [RankLevelsService],
	exports: [RankLevelsService],
})
export class RankLevelsModule {}
