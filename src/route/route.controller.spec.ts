import { Test, TestingModule } from '@nestjs/testing';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('RouteController', () => {
  let controller: RouteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteController],
      providers: [RouteService, PrismaService, JwtService],
    }).compile();

    controller = module.get<RouteController>(RouteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
