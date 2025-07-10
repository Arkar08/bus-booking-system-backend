import { PartialType } from '@nestjs/mapped-types';
import { signIndto } from './signIn.dto';

export class registerdto extends PartialType(signIndto) {
  phone: string;
  name: string;
}
