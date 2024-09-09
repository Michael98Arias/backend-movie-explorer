import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    AuthModule,  
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
