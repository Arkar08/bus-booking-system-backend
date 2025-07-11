import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) {}

  async create(createSeatDto: CreateSeatDto) {
    const { tripId, seat_number } = createSeatDto;
    if (!tripId || !seat_number) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Please Filled Out in the form field.',
        },
        HttpStatus.NOT_FOUND,
        { cause: 'Please Filled Out in the form field.' },
      );
    }

    const findTrip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
      },
    });
    if (!findTrip) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Trip Plan does not exist.',
        },
        HttpStatus.NOT_FOUND,
        { cause: 'Trip Plan does not exist.' },
      );
    }

    if (findTrip) {
      const findSeatNumber = await this.prisma.seat.findFirst({
        where: {
          tripId: tripId,
          seat_number: seat_number,
        },
      });

      if (findSeatNumber) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Seat number is already exist in this trip plan.',
          },
          HttpStatus.CONFLICT,
          { cause: 'Seat number is already exist in this trip plan.' },
        );
      }

      if (!findSeatNumber) {
        const findBusTotalSeat = await this.prisma.trip.findFirst({
          where: {
            id: tripId,
          },
        });

        const findBus = await this.prisma.bus.findFirst({
          where: {
            id: findBusTotalSeat.busId,
          },
        });

        const searchTrip = await this.prisma.seat.findMany({
          where: {
            tripId: findBusTotalSeat.id,
          },
        });

        if (searchTrip.length < findBus.total_seats - 1) {
          const newSeat = await this.prisma.seat.create({
            data: {
              tripId: tripId,
              seat_number: seat_number,
            },
            include: {
              trip: true,
            },
          });
          if (newSeat) {
            return {
              status: HttpStatus.CREATED,
              message: 'Create Seat Successfully.',
              data: newSeat,
            };
          }
        } else {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: 'Bus Limit is full.',
            },
            HttpStatus.BAD_REQUEST,
            { cause: 'Bus Limit is full.' },
          );
        }
      }
    }
  }

  async findAll() {
    const findData = await this.prisma.seat.findMany({
      take: 10,
      include: {
        trip: true,
      },
    });
    if (findData) {
      const postData = findData.map((data) => {
        const list = data;
        delete list.tripId;
        return list;
      });
      return {
        status: HttpStatus.OK,
        message: 'Fetch Seat Successfully.',
        pagination: {
          currentPage: 1,
          total: postData.length,
        },
        data: postData,
      };
    }
  }

  async findOne(id: number) {
    const findData = await this.prisma.seat.findFirst({
      where: {
        id: id,
      },
      include: {
        trip: true,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Seat Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Seat Not Found.' },
      );
    }
    if (findData) {
      const list = findData;
      delete list.tripId;
      return {
        status: HttpStatus.OK,
        message: 'Fetch Seat Successfully.',
        data: list,
      };
    }
  }

  async update(id: number, updateSeatDto: UpdateSeatDto) {
    const findData = await this.prisma.seat.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Seat Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Seat Not Found.' },
      );
    }
    if (findData) {
      const updateData = await this.prisma.seat.update({
        where: {
          id: id,
        },
        data: {
          is_booked: updateSeatDto?.is_booked,
        },
      });
      if (updateData) {
        return {
          status: HttpStatus.OK,
          message: 'Update Seat Successfully.',
          data: updateData,
        };
      }
    }
  }

  async remove(id: number) {
    const findData = await this.prisma.seat.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Seat Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Seat Not Found.' },
      );
    }
    if (findData) {
      const deleteData = await this.prisma.seat.delete({
        where: {
          id: id,
        },
      });
      if (deleteData) {
        return {
          status: HttpStatus.OK,
          message: 'Delete Seat Successfully.',
        };
      }
    }
  }
}
