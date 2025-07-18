import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusService {
  constructor(private prisma: PrismaService) {}

  async create(createBusDto: CreateBusDto) {
    const { bus_number, total_seats, type, routeId, driver_name } =
      createBusDto;
    if (!bus_number || !total_seats || !type || !routeId || !driver_name) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Please Filled Out in the form field.',
        },
        HttpStatus.NOT_FOUND,
        { cause: 'Please Filled Out in the form field.' },
      );
    }

    const findBusNumber = await this.prisma.bus.findUnique({
      where: { bus_number: bus_number },
    });

    if (findBusNumber) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Bus Number is already exist.',
        },
        HttpStatus.CONFLICT,
        { cause: 'Bus Number is already exist.' },
      );
    }

    const findRoute = await this.prisma.route.findFirst({
      where: {
        id: routeId,
      },
    });

    if (findRoute) {
      const newBus = await this.prisma.bus.create({
        data: {
          bus_number: bus_number,
          total_seats: total_seats,
          type: type,
          routeId: findRoute.id,
          driver_name: driver_name,
        },
        include: {
          route: true,
        },
      });
      if (newBus) {
        return {
          status: HttpStatus.CREATED,
          message: 'Create Bus Successfully.',
          data: newBus,
        };
      }
    }

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
  }

  async findAll() {
    const findData = await this.prisma.bus.findMany({
      take: 10,
      include: {
        route: true,
      },
    });
    if (findData) {
      const postData = findData.map((data) => {
        const list = data;
        delete list.routeId;
        return list;
      });
      return {
        status: HttpStatus.OK,
        message: 'Fetch Bus Successfully.',
        pagination: {
          currentPage: 1,
          total: postData.length,
        },
        data: postData,
      };
    }
  }

  async findOne(id: number) {
    const findData = await this.prisma.bus.findFirst({
      where: {
        id: id,
      },
      include: {
        route: true,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Bus Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Bus Not Found.' },
      );
    }
    if (findData) {
      const list = findData;
      delete list.routeId;
      return {
        status: HttpStatus.OK,
        message: 'Fetch Bus Successfully.',
        data: list,
      };
    }
  }

  async update(id: number, updateBusDto: UpdateBusDto) {
    const findData = await this.prisma.bus.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Bus Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Bus Not Found.' },
      );
    }
    if (findData) {
      const newData = await this.prisma.bus.update({
        where: {
          id: id,
        },
        data: {
          type: updateBusDto?.type,
          total_seats: updateBusDto?.total_seats,
          driver_name: updateBusDto?.driver_name,
        },
      });
      if (newData) {
        return {
          status: HttpStatus.OK,
          message: 'Update Bus Successfully.',
          data: newData,
        };
      }
    }
  }

  async remove(id: number) {
    const findData = await this.prisma.bus.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Bus Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Bus Not Found.' },
      );
    }
    if (findData) {
      const data = await this.prisma.bus.delete({ where: { id: id } });
      if (data) {
        return {
          status: HttpStatus.OK,
          message: 'Delete Bus Successfully.',
        };
      }
    }
  }
}
