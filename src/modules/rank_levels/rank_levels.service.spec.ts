import { Test, TestingModule } from '@nestjs/testing';
import { RankLevelsService } from './rank_levels.service';

describe('RankLevelsService', () => {
  let service: RankLevelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankLevelsService],
    }).compile();

    service = module.get<RankLevelsService>(RankLevelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
