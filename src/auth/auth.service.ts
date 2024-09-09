import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto) {
    const { username, email, password } = authDto;

    if (!username && !email) {
      throw new UnauthorizedException('Username or email is required');
    }

    let user;
    if (username) {
      user = await this.userService.findUserByUsername(username);
    } else if (email) {
      user = await this.userService.findUserByEmail(email);
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, id: user.id, username: user.username };
  }

  async register(authDto: AuthDto) {
    const { username, email, password } = authDto;

    if (!username || !email) {
      throw new UnauthorizedException('Username and email are required');
    }

    const existingUserByUsername = await this.userService.findUserByUsername(username);
    const existingUserByEmail = await this.userService.findUserByEmail(email);

    if (existingUserByUsername || existingUserByEmail) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser(new CreateUserDto(username, email, hashedPassword));

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, id: user.id, username: user.username };
  }
}
