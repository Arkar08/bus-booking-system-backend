import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [SearchService, PrismaService, JwtService],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
