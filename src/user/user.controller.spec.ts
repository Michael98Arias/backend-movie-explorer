import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserStatus } from './enums/user-status.enum';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SetUserStateDto } from './dto/set-user-state.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = { username: 'testuser', email: 'test@example.com', password: 'password' };
      const result: User = { 
        id: 1, 
        username: createUserDto.username, 
        email: createUserDto.email, 
        password: createUserDto.password, 
        state: UserStatus.ACTIVE, 
        created_at: new Date(), 
        updated_at: new Date()  
      };
      jest.spyOn(service, 'createUser').mockResolvedValue(result);

      expect(await controller.createUser(createUserDto)).toEqual(result);
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const result: User[] = [{
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        state: UserStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date()
      }];
      jest.spyOn(service, 'findAllUsers').mockResolvedValue(result);

      expect(await controller.findAllUsers()).toEqual(result);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const result: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        state: UserStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date()
      };
      jest.spyOn(service, 'findUserById').mockResolvedValue(result);

      expect(await controller.findUserById(1)).toEqual(result);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto = { username: 'updateduser' };
      const result: User = {
        id: 1,
        username: 'updateduser',
        email: 'test@example.com',
        password: 'password',
        state: UserStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date()
      };
      jest.spyOn(service, 'findUserById').mockResolvedValue(result);
      jest.spyOn(service, 'updateUser').mockResolvedValue(result);

      expect(await controller.updateUser(1, updateUserDto)).toEqual(result);
    });
  });

  describe('setUserState', () => {
    it('should update user state', async () => {
      const stateDto: SetUserStateDto = { state: UserStatus.INACTIVE };
      const result: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        state: stateDto.state,
        created_at: new Date(),
        updated_at: new Date()
      };
      jest.spyOn(service, 'findUserById').mockResolvedValue(result);
      jest.spyOn(service, 'setUserState').mockResolvedValue(result);

      expect(await controller.setUserState(1, stateDto)).toEqual(result);
    });
  });
});
