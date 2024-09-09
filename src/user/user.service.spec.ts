import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { UserStatus } from './enums/user-status.enum';
import { User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { SetUserStateDto } from './dto/set-user-state.dto';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      jest.spyOn(prisma.user, 'create').mockResolvedValue(result);

      expect(await service.createUser(createUserDto)).toEqual(result);
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
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(result);

      expect(await service.findAllUsers()).toEqual(result);
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
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(result);

      expect(await service.findUserById(1)).toEqual(result);
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
      jest.spyOn(prisma.user, 'update').mockResolvedValue(result);

      expect(await service.updateUser(1, updateUserDto)).toEqual(result);
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
      jest.spyOn(prisma.user, 'update').mockResolvedValue(result);

      expect(await service.setUserState(1, stateDto)).toEqual(result);
    });
  });
});
