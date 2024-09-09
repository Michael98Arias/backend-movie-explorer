import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findUserByUsername: jest.fn(),
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return an access token, id, and username if credentials are valid with username', async () => {
      const authDto = { username: 'testuser', password: 'testpassword' };
      const user = { id: 1, username: 'testuser', password: await bcrypt.hash('testpassword', 10) };
      const accessToken = 'testtoken';

      mockUserService.findUserByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await authService.login(authDto);

      expect(result).toEqual({ accessToken, id: user.id, username: user.username });
    });

    it('should return an access token, id, and username if credentials are valid with email', async () => {
      const authDto = { email: 'test@example.com', password: 'testpassword' };
      const user = { id: 1, username: 'testuser', password: await bcrypt.hash('testpassword', 10) };
      const accessToken = 'testtoken';

      mockUserService.findUserByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await authService.login(authDto);

      expect(result).toEqual({ accessToken, id: user.id, username: user.username });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const authDto = { username: 'testuser', password: 'wrongpassword' };
      const user = { id: 1, username: 'testuser', password: await bcrypt.hash('testpassword', 10) };

      mockUserService.findUserByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login(authDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should return an access token, id, and username if registration is successful', async () => {
      const authDto = { username: 'newuser', email: 'newuser@example.com', password: 'newpassword' };
      const hashedPassword = await bcrypt.hash('newpassword', 10);
      const user = { id: 2, username: 'newuser', password: hashedPassword };
      const accessToken = 'newtoken';

      mockUserService.findUserByUsername.mockResolvedValue(null);
      mockUserService.findUserByEmail.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await authService.register(authDto);

      expect(result).toEqual({ accessToken, id: user.id, username: user.username });
    });

    it('should throw ConflictException if username or email already exists', async () => {
      const authDto = { username: 'existinguser', email: 'existinguser@example.com', password: 'password' };
      const existingUser = { id: 1, username: 'existinguser', password: 'hashedpassword' };

      mockUserService.findUserByUsername.mockResolvedValue(existingUser);
      mockUserService.findUserByEmail.mockResolvedValue(null);

      await expect(authService.register(authDto)).rejects.toThrow(ConflictException);
    });
  });
});
