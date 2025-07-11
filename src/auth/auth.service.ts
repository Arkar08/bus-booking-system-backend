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
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userSerive: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async SignIn(SignInUser: signIndto) {
    const { email, password } = SignInUser;

    if (!email || !password) {
      throw new HttpException(
        'Please Filled Out in the form field.',
        HttpStatus.NOT_FOUND,
      );
    }
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
          const payload = {
            sub: validatorActive.id,
            username: validatorActive.name,
            role: validatorActive.role,
          };
          return {
            status: HttpStatus.OK,
            message: 'Login Successfully.',
            data: {
              email: validator.email,
              id: validator.id,
              role: validator.role,
              token: await this.jwtService.signAsync(payload),
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
    const { name, email, password, phone } = registerUser;

    if (!name || !email || !password || !phone) {
      throw new HttpException(
        'Please Filled Out in the form field.',
        HttpStatus.NOT_FOUND,
      );
    }

    const validator = await this.userSerive.validateEmail(registerUser.email);
    if (validator) {
      throw new HttpException(
        'Email is already exist.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const validatorName = await this.userSerive.validateName(registerUser.name);
    if (validatorName) {
      throw new HttpException('Name is already exist.', HttpStatus.BAD_REQUEST);
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
      },
    });
    const payload = {
      sub: newUser.id,
      username: newUser.name,
      role: newUser.role,
    };
    return {
      status: HttpStatus.OK,
      message: 'Register Successfully.',
      data: {
        email: newUser.email,
        role: newUser.role,
        id: newUser.id,
        token: await this.jwtService.signAsync(payload),
      },
    };
  }

  async Logout() {
    console.log('hello');
  }
}
