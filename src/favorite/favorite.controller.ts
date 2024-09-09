import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { PrismaService } from '../prisma/prisma.service'; 
import { FavoriteDto } from './dto/favorite.dto';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  async create(@Body() createFavoriteDto: FavoriteDto): Promise<Favorite> {
    const { userId, movieIds } = createFavoriteDto;
    if (!userId || !movieIds) {
      throw new Error('userId and movieIds are required');
    }
    return this.favoriteService.createFavorite(userId, movieIds);
  }

  @Get(':userId')
  async findByUserId(@Param('userId') userId: number): Promise<Favorite | null> {
    return this.favoriteService.findFavoritesByUserId(userId);
  }

  @Put(':userId')
  async update(
    @Param('userId') userId: number,
    @Body() updateFavoriteDto: FavoriteDto
  ): Promise<Favorite> {
    const { movieIds } = updateFavoriteDto;
    if (!movieIds) {
      throw new Error('movieIds is required');
    }
    return this.favoriteService.updateFavorite(userId, movieIds);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: number): Promise<Favorite> {
    return this.favoriteService.deleteFavorite(userId);
  }
}
