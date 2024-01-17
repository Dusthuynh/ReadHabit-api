import { Test, TestingModule } from '@nestjs/testing';
import { RankController } from './ranks.controller';

describe('RankController', () => {
	let controller: RankController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RankController],
		}).compile();

		controller = module.get<RankController>(RankController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
