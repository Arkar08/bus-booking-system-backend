import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RouteModule } from './route/route.module';
import { BusModule } from './bus/bus.module';
import { TripModule } from './trip/trip.module';
import { SeatModule } from './seat/seat.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    RouteModule,
    BusModule,
    TripModule,
    SeatModule,
    BookingsModule,
    PaymentsModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
