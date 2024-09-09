import { Controller, Get, Param, Post, Body, Put, Patch, NotFoundException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserStatus } from './enums/user-status.enum';
import { SetUserStateDto } from './dto/set-user-state.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(":id")
  async findUserById(@Param("id") id: number) {
    const userFound = await this.userService.findUserById(Number(id));
    if (!userFound) throw new NotFoundException('User does not exist');
    return userFound;
  }

  @Put(":id")
  async updateUser(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findUserById(Number(id));
    if (!user) throw new NotFoundException('User does not exist');
    return this.userService.updateUser(Number(id), updateUserDto);
  }

  @Patch(":id/state")
  async setUserState(@Param("id") id: number, @Body() setUserStateDto: SetUserStateDto) {
    const user = await this.userService.findUserById(Number(id));
    if (!user) throw new NotFoundException('User does not exist');
    return this.userService.setUserState(Number(id), setUserStateDto);
  }
}
