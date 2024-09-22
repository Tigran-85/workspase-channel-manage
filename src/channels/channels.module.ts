import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/users.entity";
import { Workspace } from "../workspaces/entities/workspaces.entity";
import { JwtModule } from "@nestjs/jwt";
import { Channel } from "./entities/channels.entity";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Channel, Workspace]),
        JwtModule,
    ],
    controllers: [ChannelsController],
    providers: [ChannelsService]
})
export class ChannelsModule {}
