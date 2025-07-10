export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'User';
  phone: string;
}
