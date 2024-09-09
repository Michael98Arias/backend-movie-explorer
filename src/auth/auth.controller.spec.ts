import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
};

const mockUserService = {
  findUserByUsername: jest.fn(),
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token, id, and username if credentials are valid with username', async () => {
      const authDto = { username: 'testuser', password: 'testpassword' };
      const user = { id: 1, username: 'testuser', password: await bcrypt.hash('testpassword', 10) };
      const accessToken = 'testtoken';

      mockAuthService.login.mockResolvedValue({ accessToken, id: user.id, username: user.username });

      const result = await controller.login(authDto);

      expect(result).toEqual({ accessToken, id: user.id, username: user.username });
    });

    it('should return an access token, id, and username if credentials are valid with email', async () => {
      const authDto = { email: 'test@example.com', password: 'testpassword' };
      const user = { id: 1, username: 'testuser', password: await bcrypt.hash('testpassword', 10) };
      const accessToken = 'testtoken';

      mockAuthService.login.mockResolvedValue({ accessToken, id: user.id, username: user.username });

      const result = await controller.login(authDto);

      expect(result).toEqual({ accessToken, id: user.id, username: user.username });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const authDto = { username: 'testuser', password: 'wrongpassword' };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(authDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should return an access token, id, and username if registration is successful', async () => {
      const authDto = { username: 'newuser', email: 'newuser@example.com', password: 'newpassword' };
      const hashedPassword = await bcrypt.hash('newpassword', 10);
      const user = { id: 2, username: 'newuser', password: hashedPassword };
      const accessToken = 'newtoken';

      mockAuthService.register.mockResolvedValue({ accessToken, id: user.id, username: user.username });

      const result = await controller.register(authDto);

      expect(result).toEqual({ accessToken, id: user.id, username: user.username });
    });

    it('should throw ConflictException if username or email already exists', async () => {
      const authDto = { username: 'existinguser', email: 'existinguser@example.com', password: 'password' };

      mockAuthService.register.mockRejectedValue(new ConflictException());

      await expect(controller.register(authDto)).rejects.toThrow(ConflictException);
    });
  });
});
