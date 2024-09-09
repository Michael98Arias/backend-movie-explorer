import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 
import { Prisma, Favorite } from '@prisma/client';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async createFavorite(userId: number, movieIds: string): Promise<Favorite> {
    return this.prisma.favorite.create({
      data: {
        user_id: userId,
        movieIds,
      },
    });
  }

  async findFavoritesByUserId(userId: number): Promise<Favorite | null> {
    return this.prisma.favorite.findUnique({
      where: { user_id: userId },
    });
  }

  async updateFavorite(userId: number, movieIds: string): Promise<Favorite> {
    return this.prisma.favorite.update({
      where: { user_id: userId },
      data: { movieIds },
    });
  }

  async deleteFavorite(userId: number): Promise<Favorite> {
    return this.prisma.favorite.delete({
      where: { user_id: userId },
    });
  }
}
