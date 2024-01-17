import { Module } from '@nestjs/common';
import { RankService } from './ranks.service';
import { RankController } from './ranks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rank } from './entities/rank.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Rank])],
	providers: [RankService],
	controllers: [RankController],
	exports: [RankService],
})
export class RanksModule {}
