import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, role, phone } = createUserDto;
    if (!name || !email || !password || !phone) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Please Filled Out in the form field.',
        },
        HttpStatus.NOT_FOUND,
        { cause: 'Please Filled Out in the form field.' },
      );
    }

    const findEmail = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findEmail) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Email is already exist.',
        },
        HttpStatus.CONFLICT,
        { cause: 'Email is already exist.' },
      );
    }

    const findName = await this.prisma.user.findFirst({
      where: {
        name: name,
      },
    });
    if (findName) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Name is already exist.',
        },
        HttpStatus.CONFLICT,
        { cause: 'Name is already exist.' },
      );
    }

    if (password.length < 6) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Password should be greater than 6',
        },
        HttpStatus.BAD_REQUEST,
        { cause: 'Password should be greater than 6' },
      );
    }

    if (phone.length > 11) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Phone Number should be less than 11',
        },
        HttpStatus.BAD_REQUEST,
        { cause: 'Phone Number should be less than 11' },
      );
    }

    const saltOrRounds = 10;
    const hashPassword = password;
    const hash = await bcrypt.hash(hashPassword, saltOrRounds);

    const newUser = await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hash,
        phone: phone,
        role: role,
      },
    });
    if (newUser) {
      return {
        status: HttpStatus.CREATED,
        message: 'Create User Successfully.',
        data: newUser,
      };
    }
  }

  async findAll() {
    const findData = await this.prisma.user.findMany({
      include: {
        booked: true,
      },
    });
    if (findData) {
      return {
        status: HttpStatus.OK,
        message: 'Fetch User Successfully.',
        length: findData.length,
        data: findData,
      };
    }
  }

  async findOne(id: number) {
    const findData = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      include: {
        booked: true,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'User Not Found.' },
      );
    }
    if (findData) {
      return {
        status: HttpStatus.OK,
        message: 'Fetch User Successfully.',
        data: findData,
      };
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto?.email) {
      const findEmail = await this.prisma.user.findUnique({
        where: {
          email: updateUserDto?.email,
        },
      });

      if (findEmail.id !== id) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Email is already exist.',
          },
          HttpStatus.CONFLICT,
          { cause: 'Email is already exist.' },
        );
      }
    }

    if (updateUserDto?.name) {
      const findName = await this.prisma.user.findFirst({
        where: {
          name: updateUserDto?.name,
        },
      });
      if (findName.id !== id) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Name is already exist.',
          },
          HttpStatus.CONFLICT,
          { cause: 'Name is already exist.' },
        );
      }
    }

    if (updateUserDto?.password) {
      if (updateUserDto?.password.length < 6) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Password should be greater than 6',
          },
          HttpStatus.BAD_REQUEST,
          { cause: 'Password should be greater than 6' },
        );
      }
    }

    if (updateUserDto?.phone) {
      if (updateUserDto?.phone.length > 11) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Phone Number should be less than 11',
          },
          HttpStatus.BAD_REQUEST,
          { cause: 'Phone Number should be less than 11' },
        );
      }
    }

    const saltOrRounds = 10;
    const hashPassword = updateUserDto?.password;
    const hash = await bcrypt.hash(hashPassword, saltOrRounds);

    const updateData = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: updateUserDto?.name,
        email: updateUserDto?.email,
        password: hash,
        phone: updateUserDto?.phone,
      },
    });
    if (updateData) {
      return {
        status: HttpStatus.OK,
        message: 'Update User Successfully.',
        data: updateData,
      };
    }
  }

  async remove(id: number) {
    const findData = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      include: {
        booked: true,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'User Not Found.' },
      );
    }
    if (findData) {
      const deleteData = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      if (deleteData) {
        return {
          status: HttpStatus.OK,
          message: 'Delete User Successfully.',
        };
      }
    }
  }
}
