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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { RolesGuard } from 'src/auth/role/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something Went Wrong.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll() {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something Went Wrong.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.usersService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something Went Wrong.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.usersService.update(+id, updateUserDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something Went Wrong.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.usersService.remove(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something Went Wrong.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
