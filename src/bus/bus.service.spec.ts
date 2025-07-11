import { Test, TestingModule } from '@nestjs/testing';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('BusService', () => {
  let service: BusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusService, PrismaService, JwtService],
      controllers: [BusController],
    }).compile();

    service = module.get<BusService>(BusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
