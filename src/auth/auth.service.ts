import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { signIndto } from './dto/signIn.dto';
import { registerdto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async SignIn(SignInUser: signIndto) {
    console.log(SignInUser);
  }

  async Register(registerUser: registerdto) {
    console.log(registerUser);
  }

  async Logout() {
    console.log('hello');
  }
}
