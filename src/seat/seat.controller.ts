import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { AuthGuard } from '../auth/guard/auth/auth.guard';
import { Roles } from '../auth/guard/role/roles.decorator';
import { Role } from '../auth/guard/role/roles.enum';
import { RolesGuard } from '../auth/guard/role/role.guard';

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createSeatDto: CreateSeatDto) {
    try {
      return this.seatService.create(createSeatDto);
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
      return this.seatService.findAll();
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

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.seatService.findOne(+id);
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    try {
      return this.seatService.update(+id, updateSeatDto);
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

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.seatService.remove(+id);
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
