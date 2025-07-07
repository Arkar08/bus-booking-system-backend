import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RouteService {
  constructor(private prisma: PrismaService) {}

  async create(createRouteDto: CreateRouteDto) {
    const { source, destination, distance, duration } = createRouteDto;
    if (!source || !destination || !distance || !duration) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Please Filled Out in the Form Field.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Please Filled Out in the Form Field.' },
      );
    }

    const findRoute = await this.prisma.route.findMany({
      where: {
        source: source,
        destination: destination,
      },
    });
    if (findRoute.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Route is already exist.',
        },
        HttpStatus.CONFLICT,
        { cause: 'Route is already exist.' },
      );
    }
    if (findRoute.length <= 0) {
      const newRoute = await this.prisma.route.create({
        data: {
          source: source,
          destination: destination,
          duration: duration,
          distance: distance,
        },
      });
      return {
        status: HttpStatus.CREATED,
        message: 'Create Route Successfully.',
        data: newRoute,
      };
    }
  }

  async findAll() {
    const findData = await this.prisma.route.findMany();
    if (findData) {
      return {
        status: HttpStatus.OK,
        message: 'Fetch Route Successfully.',
        length: findData.length,
        data: findData,
      };
    }
  }

  async findOne(id: number) {
    const findData = await this.prisma.route.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Route Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Route Not Found.' },
      );
    }
    if (findData) {
      return {
        status: HttpStatus.OK,
        message: 'Fetch Route Successfully.',
        data: findData,
      };
    }
  }

  async update(id: number, updateRouteDto: UpdateRouteDto) {
    const findData = await this.prisma.route.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Route Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Route Not Found.' },
      );
    }
    if (findData) {
      if (updateRouteDto.source && updateRouteDto.destination) {
        const findUpdateList = await this.prisma.route.findMany({
          where: {
            source: updateRouteDto.source,
            destination: updateRouteDto.destination,
          },
        });
        if (findUpdateList.length > 0) {
          throw new HttpException(
            {
              status: HttpStatus.CONFLICT,
              error: 'Route is already exist.',
            },
            HttpStatus.CONFLICT,
            { cause: 'Route is already exist.' },
          );
        } else {
          const updateData = await this.prisma.route.update({
            where: { id: id },
            data: {
              source: updateRouteDto?.source,
              destination: updateRouteDto?.destination,
              distance: updateRouteDto?.distance,
              duration: updateRouteDto?.duration,
            },
          });
          return {
            status: HttpStatus.OK,
            message: 'Update Route Successfully.',
            data: updateData,
          };
        }
      } else {
        const updateData = await this.prisma.route.update({
          where: { id: id },
          data: {
            source: updateRouteDto.source,
            destination: updateRouteDto.destination,
            distance: updateRouteDto.distance,
            duration: updateRouteDto.duration,
          },
        });

        return {
          status: HttpStatus.OK,
          message: 'Update Route Successfully.',
          data: updateData,
        };
      }
    }
  }

  async remove(id: number) {
    const findData = await this.prisma.route.findFirst({
      where: {
        id: id,
      },
    });
    if (!findData) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Route Not Found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'Route Not Found.' },
      );
    }
    if (findData) {
      const data = await this.prisma.route.delete({ where: { id: id } });
      if (data) {
        return {
          status: HttpStatus.OK,
          message: 'Delete Route Successfully.',
        };
      }
    }
  }
}
