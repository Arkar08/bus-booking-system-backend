import { Global, Module } from '@nestjs/common';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [BusController],
  providers: [BusService],
  exports: [BusService],
})
export class BusModule {}
