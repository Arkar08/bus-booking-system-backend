import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TripService {
  constructor(private prisma: PrismaService) {}

  async create(createTripDto: CreateTripDto) {
    const { busId, routeId, departure_time, arrival_time, trip_date, price } =
      createTripDto;
    if (
      !busId ||
      !routeId ||
      !departure_time ||
      !arrival_time ||
      !trip_date ||
      !price
    ) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Please Filled Out in the form field.',
        },
        HttpStatus.NOT_FOUND,
        { cause: 'Please Filled Out in the form field.' },
      );
    }

    const findBus = await this.prisma.bus.findFirst({
      where: {
        id: busId,
      },
    });

    if (!findBus) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Bus does not exist.',
        },
        HttpStatus.NOT_FOUND,
        { cause: 'Bus does not exist.' },
      );
    }
    if (findBus) {
      const findRoute = await this.prisma.bus.findFirst({
        where: {
          id: busId,
          routeId: routeId,
        },
      });
      if (!findRoute) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Route does not exist.',
          },
          HttpStatus.NOT_FOUND,
          { cause: 'Route does not exist.' },
        );
      }
      if (findRoute) {
        const findRouteAndBus = await this.prisma.trip.findFirst({
          where: {
            busId: busId,
            routeId: routeId,
          },
        });
        if (!findRouteAndBus) {
          const newTrip = await this.prisma.trip.create({
            data: {
              busId: busId,
              routeId: routeId,
              departure_time: departure_time,
              arrival_time: arrival_time,
              trip_date: trip_date,
              price: price,
            },
            include: {
              bus: true,
              route: true,
            },
          });
          if (newTrip) {
            return {
              status: HttpStatus.CREATED,
              message: 'Create Trip Successfully.',
              data: newTrip,
            };
          }
        }
        if (findRouteAndBus) {
          throw new HttpException(
            {
              status: HttpStatus.CONFLICT,
              error: 'Trip plan is already exist.',
            },
            HttpStatus.CONFLICT,
            { cause: 'Trip plan is already exist.' },
          );
        }
      }
    }
  }

  async findAll() {
    const findData = await this.prisma.trip.findMany();
    if (findData) {
      return {
        status: HttpStatus.OK,
        message: 'Fetch Trip Plan Successfully.',
        length: findData.length,
        data: findData,
      };
    }
  }

  async findOne(id: number) {
    const findData = await this.prisma.trip.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Trip Plan Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Trip Plan Not Found.' },
      );
    }
    if (findData) {
      return {
        status: HttpStatus.OK,
        message: 'Fetch Trip Plan Successfully.',
        data: findData,
      };
    }
  }

  async update(id: number, updateTripDto: UpdateTripDto) {
    const findData = await this.prisma.trip.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Trip Plan Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Trip Plan Not Found.' },
      );
    }
    if (findData) {
      const updateData = await this.prisma.trip.update({
        where: {
          id: id,
        },
        data: {
          arrival_time: updateTripDto?.arrival_time,
          departure_time: updateTripDto?.departure_time,
          trip_date: updateTripDto?.trip_date,
          price: updateTripDto?.price,
        },
      });
      if (updateData) {
        return {
          status: HttpStatus.OK,
          message: 'Update Trip Plan Successfully.',
          data: updateData,
        };
      }
    }
  }

  async remove(id: number) {
    const findData = await this.prisma.trip.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Trip Plan Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Trip Plan Not Found.' },
      );
    }
    if (findData) {
      const data = await this.prisma.trip.delete({ where: { id: id } });
      if (data) {
        return {
          status: HttpStatus.OK,
          message: 'Delete Trip Plan Successfully.',
        };
      }
    }
  }
}
