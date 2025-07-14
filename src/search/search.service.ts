import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchRouteDto } from './dto/search-route-dto';
import { Route } from 'generated/prisma';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async getRoute(searchRoute: SearchRouteDto) {
    if (!searchRoute.to) {
      const fromData = searchRoute.from?.toLowerCase();
      const data = await this.prisma.$queryRaw<Route[]>`
        SELECT * FROM \`Route\` WHERE LOWER(\`source\`) = ${fromData}
        `;
      return data?.length > 0
        ? {
            status: HttpStatus.OK,
            message: 'Search Route Successfully.',
            data: data,
          }
        : {
            status: HttpStatus.NOT_FOUND,
            message: 'Route Not Found.',
          };
    } else {
      const fromData = searchRoute.from?.toLowerCase();
      const destination = searchRoute.to?.toLowerCase();
      const data = await this.prisma.$queryRaw<Route[]>`
        SELECT * FROM \`Route\` WHERE LOWER(\`source\`) = ${fromData} AND LOWER(\`destination\`) = ${destination}
        `;
      return data?.length > 0
        ? {
            status: HttpStatus.OK,
            message: 'Search Route Successfully.',
            data: data,
          }
        : {
            status: HttpStatus.NOT_FOUND,
            message: 'Route Not Found.',
          };
    }
  }
}
