import {Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards} from '@nestjs/common';
import { WorkspacesService } from "./workspaces.service";
import { AuthGuard } from '../common/guards/jwt.authGuard';
import { CreateWorkspaceDto } from "./dtos/create-workspace.dto";
import { Workspace } from "./entities/workspaces.entity";
import {FindOperator} from "typeorm";
import {UpdateWorkspaceDto} from "./dtos/update-workspace.dto";
import {InviteUserDto} from "./dtos/invite-user.dto";

@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @UseGuards(AuthGuard)
    @Post('create')
    create(@Request() req, @Body() createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
        const user = req.user;
        return this.workspacesService.create(user, createWorkspaceDto);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    getWorkSpaceById (@Request() req, @Param('id') id: FindOperator<number>) {
        const user = req.user;
        return this.workspacesService.getWorkSpaceById(user, id);
    }

    @UseGuards(AuthGuard)
    @Get()
    getWorkSpaces (@Request() req) {
        const user = req.user;
        return this.workspacesService.getWorkspaces(user);
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    updateWorkspace(
        @Request() req,
        @Param('id') id: FindOperator<number>,
        @Body() updateWorkSpaceDto: UpdateWorkspaceDto,
    ) {
        const user = req.user;
        return this.workspacesService.updateWorkspace(user, id, updateWorkSpaceDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    deleteWorkspace(
        @Request() req,
        @Param('id') id: FindOperator<number>
    ) {
        const user = req.user;
        return this.workspacesService.deleteWorkspace(user, id);
    }

    @UseGuards(AuthGuard)
    @Post('invite')
    async inviteUser(
        @Request() req,
        @Body() inviteUserDto: InviteUserDto
    ) {
        const user = req.user;
        return this.workspacesService.inviteUserToWorkspace(user, inviteUserDto);
    }
}
