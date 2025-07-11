import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private bookingService: BookingsService,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    const { bookedId, amount, payment_method } = createPaymentDto;
    if (!bookedId || !amount || !payment_method) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Please Filled Out in the form field.',
        },
        HttpStatus.NOT_FOUND,
        { cause: 'Please Filled Out in the form field.' },
      );
    }
    const findBooking = await this.prisma.booked.findFirst({
      where: {
        id: bookedId,
      },
    });

    if (!findBooking) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'BookingId does not exist.',
        },
        HttpStatus.BAD_REQUEST,
        { cause: 'BookingId does not exist.' },
      );
    }

    if (findBooking) {
      if (findBooking.status !== 'Paid') {
        const postData = await this.prisma.payment.create({
          data: {
            bookedId: findBooking.id,
            amount: amount,
            payment_method: payment_method,
          },
        });
        if (postData) {
          const updateStatus = {
            status: 'Paid',
          };
          await this.bookingService.update(findBooking.id, updateStatus);
          return {
            status: HttpStatus.CREATED,
            message: 'Payment Successfully.',
            data: postData,
          };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Payment is already released.',
        };
      }
    }
  }

  async findAll() {
    const findData = await this.prisma.payment.findMany({
      take: 10,
      include: {
        booked: true,
      },
    });
    if (findData) {
      return {
        status: HttpStatus.OK,
        message: 'Fetch Payment Successfully.',
        pagination: {
          currentPage: 1,
          total: findData.length,
        },
        data: findData,
      };
    }
  }
}
