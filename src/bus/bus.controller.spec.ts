import { Test, TestingModule } from '@nestjs/testing';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('BusController', () => {
  let controller: BusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusController],
      providers: [BusService, PrismaService, JwtService],
    }).compile();

    controller = module.get<BusController>(BusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
