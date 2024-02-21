import { Test, TestingModule } from '@nestjs/testing';
import { RankLevelsController } from './rank_levels.controller';

describe('RankLevelsController', () => {
  let controller: RankLevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankLevelsController],
    }).compile();

    controller = module.get<RankLevelsController>(RankLevelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
