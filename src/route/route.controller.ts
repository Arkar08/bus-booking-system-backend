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
import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { RolesGuard } from 'src/auth/role/role.guard';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    try {
      return this.routeService.create(createRouteDto);
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
      return this.routeService.findAll();
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
      return this.routeService.findOne(+id);
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    try {
      return this.routeService.update(+id, updateRouteDto);
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
      return this.routeService.remove(+id);
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
