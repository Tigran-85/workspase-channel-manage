import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/users.entity";
import { JwtModule } from "@nestjs/jwt";
import { Workspace } from "./entities/workspaces.entity";
import { MailService } from "../common/services/email.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Workspace]),
    JwtModule,
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, MailService]
})
export class WorkspacesModule {}
