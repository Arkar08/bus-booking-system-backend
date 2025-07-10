import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { signIndto } from './dto/signIn.dto';
import { registerdto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private userSerive: UsersService,
    private prisma: PrismaService,
  ) {}

  async SignIn(SignInUser: signIndto) {
    const validator = await this.userSerive.validateEmail(SignInUser.email);
    if (!validator) {
      throw new UnauthorizedException();
    }
    if (validator) {
      const validtorPassword = await bcrypt.compare(
        SignInUser.password,
        validator.password,
      );
      if (!validtorPassword) {
        throw new HttpException('Password is wrong.', HttpStatus.NOT_FOUND);
      }

      if (validtorPassword) {
        const validatorActive = await this.userSerive.validateActive(
          validator.id,
        );
        if (validatorActive.status === 'Active') {
          return {
            status: HttpStatus.OK,
            message: 'Login Successfully.',
            data: {
              email: validator.email,
              id: validator.id,
              role: validator.role,
            },
          };
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'User accout is blocked ,please contact to Admin.',
          };
        }
      }
    }
  }

  async Register(registerUser: registerdto) {
    console.log(registerUser);
  }

  async Logout() {
    console.log('hello');
  }
}
