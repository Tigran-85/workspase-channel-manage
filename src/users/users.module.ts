import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { Workspace } from "../workspaces/entities/workspaces.entity";
import { Channel } from "../channels/entities/channels.entity";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      ServeStaticModule.forRoot({
          rootPath: join('uploads'),
          serveRoot: '/uploads',
      }),
      Workspace,
      Channel,
      JwtModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}