import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FavoriteDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  movieIds?: string;

  static createFavoriteDto(userId: number, movieIds: string) {
    return {
      userId,
      movieIds,
    };
  }

  static updateFavoriteDto(movieIds: string) {
    return {
      movieIds,
    };
  }
}
