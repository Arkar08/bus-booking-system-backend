import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('TripController', () => {
  let controller: TripController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
      providers: [TripService, PrismaService, JwtService],
    }).compile();

    controller = module.get<TripController>(TripController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
