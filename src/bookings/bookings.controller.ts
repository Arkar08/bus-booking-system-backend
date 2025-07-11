import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
// import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '../auth/guard/auth/auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    try {
      return this.bookingsService.create(createBookingDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    try {
      return this.bookingsService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.bookingsService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
  //   try {
  //     return this.bookingsService.update(+id, updateBookingDto);
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.INTERNAL_SERVER_ERROR,
  //         error: 'Something went wrong.',
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       { cause: error },
  //     );
  //   }
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.bookingsService.remove(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
