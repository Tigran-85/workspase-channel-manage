import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTService } from 'src/common/services/jwt.service';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { User } from '../users/entities/users.entity';
import { HttpModule } from '@nestjs/axios';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXP'),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    JwtModule,
    PassportModule
  ],
  providers: [
    AuthService,
    JWTService,
    UsersService,
    JwtStrategy,
  ],
  controllers: [AuthController]
})
export class AuthModule {}