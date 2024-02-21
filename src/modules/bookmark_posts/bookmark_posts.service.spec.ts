import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkPostsService } from './bookmark_posts.service';

describe('BookmarkPostsService', () => {
  let service: BookmarkPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookmarkPostsService],
    }).compile();

    service = module.get<BookmarkPostsService>(BookmarkPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
