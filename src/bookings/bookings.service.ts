import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const { userId, tripId } = createBookingDto;
    if (!userId || !tripId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Please Filled Out in the form field.',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: 'Please Filled Out in the form field.',
        },
      );
    }

    const findUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (findUser) {
      const findTrip = await this.prisma.trip.findFirst({
        where: {
          id: tripId,
        },
      });

      if (findTrip) {
        const newBooking = await this.prisma.booked.create({
          data: {
            userId: userId,
            tripId: tripId,
            total_price: findTrip.price,
          },
          include: {
            user: true,
            trip: true,
          },
        });
        if (newBooking) {
          return {
            status: HttpStatus.CREATED,
            message: 'Booking Successfully.',
            data: newBooking,
          };
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Trip Plan does not exist.',
          },
          HttpStatus.NOT_FOUND,
          { cause: 'Trip Plan does not exist.' },
        );
      }
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User does not exist.',
        },
        HttpStatus.NOT_FOUND,
        { cause: 'User does not exist.' },
      );
    }
  }

  async findAll() {
    const findData = await this.prisma.booked.findMany({
      take: 10,
      include: {
        user: true,
        trip: true,
        payment: true,
      },
    });
    if (findData) {
      return {
        status: HttpStatus.OK,
        message: 'Fetch Booking Successfully.',
        pagination: {
          currentPage: 1,
          total: findData.length,
        },
        data: findData,
      };
    }
  }

  async findOne(id: number) {
    const findData = await this.prisma.booked.findFirst({
      where: {
        id: id,
      },
      include: {
        user: true,
        trip: true,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Booking Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Booking Not Found.' },
      );
    }
    if (findData) {
      return {
        status: HttpStatus.OK,
        message: 'Fetch Booking Successfully.',
        data: findData,
      };
    }
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const findData = await this.prisma.booked.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Booking Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Booking Not Found.' },
      );
    }
    if (findData) {
      const updateData = await this.prisma.booked.update({
        where: {
          id: id,
        },
        data: {
          status: updateBookingDto?.status,
        },
      });
      if (updateData) {
        return {
          status: HttpStatus.OK,
          message: `${updateBookingDto?.status} Successuflly.`,
          data: updateData,
        };
      }
    }
  }
}
