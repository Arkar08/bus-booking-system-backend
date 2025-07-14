import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SearchRouteDto } from './dto/search-route-dto';
import { SearchService } from './search.service';
import { Roles } from '../auth/guard/role/roles.decorator';
import { Role } from '../auth/guard/role/roles.enum';
import { AuthGuard } from '../auth/guard/auth/auth.guard';
import { RolesGuard } from '../auth/guard/role/role.guard';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  searchRoute(@Query() query: SearchRouteDto) {
    try {
      return this.searchService.getRoute(query);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something Went Wrong.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
