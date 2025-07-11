import { Test, TestingModule } from '@nestjs/testing';
import { RouteService } from './route.service';
import { PrismaService } from '../prisma/prisma.service';
import { RouteController } from './route.controller';
import { JwtService } from '@nestjs/jwt';

describe('RouteService', () => {
  let service: RouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteService, PrismaService, JwtService],
      controllers: [RouteController],
    }).compile();

    service = module.get<RouteService>(RouteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
