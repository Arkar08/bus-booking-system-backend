import { Test, TestingModule } from '@nestjs/testing';
import { TripService } from './trip.service';
import { PrismaService } from '../prisma/prisma.service';
import { TripController } from './trip.controller';
import { JwtService } from '@nestjs/jwt';

describe('TripService', () => {
  let service: TripService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripService, PrismaService, JwtService],
      controllers: [TripController],
    }).compile();

    service = module.get<TripService>(TripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
