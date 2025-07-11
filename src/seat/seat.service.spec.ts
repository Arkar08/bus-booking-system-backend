import { Test, TestingModule } from '@nestjs/testing';
import { SeatService } from './seat.service';
import { PrismaService } from '../prisma/prisma.service';
import { SeatController } from './seat.controller';
import { JwtService } from '@nestjs/jwt';

describe('SeatService', () => {
  let service: SeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeatService, PrismaService, JwtService],
      controllers: [SeatController],
    }).compile();

    service = module.get<SeatService>(SeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
