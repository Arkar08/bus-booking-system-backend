import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
    const findData = await this.prisma.bus.findMany();
    if (findData) {
      return {
        status: HttpStatus.OK,
        message: 'Fetch Bus Successfully.',
        length: findData.length,
        data: findData,
      };
    }
  }

  async findOne(id: number) {
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
      return {
        status: HttpStatus.OK,
        message: 'Fetch Bus Successfully.',
        data: findData,
      };
    }
  }

  async update(id: number, updateBusDto: UpdateBusDto) {
    const findData = await this.prisma.bus.findFirst({
      where: {
        id: id,
      },
    });
    const findBusNumber = await this.prisma.bus.findUnique({
      where: { bus_number: updateBusDto?.bus_number },
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
      if (updateBusDto.routeId) {
        const findRoute = await this.prisma.route.findFirst({
          where: {
            id: updateBusDto?.routeId,
          },
        });
        if (findRoute) {
          const newData = await this.prisma.bus.update({
            where: {
              id: id,
            },
            data: {
              bus_number: updateBusDto?.bus_number,
              type: updateBusDto?.type,
              total_seats: updateBusDto?.total_seats,
              routeId: updateBusDto?.routeId,
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
      } else {
        const newData = await this.prisma.bus.update({
          where: {
            id: id,
          },
          data: {
            bus_number: updateBusDto?.bus_number,
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
