import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SearchController } from './search.controller';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, PrismaService, JwtService],
      controllers: [SearchController],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
