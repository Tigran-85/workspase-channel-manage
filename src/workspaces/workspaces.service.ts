import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { Workspace } from "./entities/workspaces.entity";
import { CreateWorkspaceDto } from "./dtos/create-workspace.dto";
import { JwtPayload } from "../common/interfaces/jwt.interface";
import { InjectRepository } from "@nestjs/typeorm";
import {FindOperator, In, Repository} from "typeorm";
import { User } from "../users/entities/users.entity";
import { ERROR_MESSAGES, RESPONSE_MESSAGES } from "../common/constants/responseMessages.constant";
import { UpdateWorkspaceDto } from "./dtos/update-workspace.dto";
import { InviteUserDto } from "./dtos/invite-user.dto";
import { MailService } from "../common/services/email.service";

@Injectable()
export class WorkspacesService {
    constructor(
        @InjectRepository(Workspace)
        private readonly workspaceRepository: Repository<Workspace>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly mailService: MailService,
    ) { }

    async create(user: JwtPayload, createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {

        const existingUser: User = await this.userRepository.findOne({
            where: {
                id: user.userId
            }
        });

        if (!existingUser) {
            throw new ConflictException(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        const existingWorkspace = await this.workspaceRepository.findOne({
            where: { uniqueSlag: createWorkspaceDto.uniqueSlag },
        });

        if (existingWorkspace) {
            throw new ConflictException(ERROR_MESSAGES.UNIQUESLAG_EXIST);
        }

        const workspace: Workspace = this.workspaceRepository.create({
            ...createWorkspaceDto,
            user: existingUser
        });

        await this.workspaceRepository.save(workspace);

        return workspace;
    }

    async getWorkSpaceById(user: JwtPayload, id: FindOperator<number>): Promise<Workspace> {
        const userWorkSpace: Workspace = await this.workspaceRepository.findOne({
            relations: {
                channels: true,
            },
            where: {
                id,
                user: {
                    id: user.userId,
                },
            },
        });

        if (!userWorkSpace) {
            throw new NotFoundException(ERROR_MESSAGES.WORKSPACE_NOT_FOUND);
        }

        return userWorkSpace
    }

    async getWorkspaces(user: JwtPayload): Promise<Workspace[]> {
        const userWorkSpaces: Workspace[] = await this.workspaceRepository.find({
            relations: {
                channels: true,
            },
            where: {
                user: In([user.userId])
            },
        });

        return userWorkSpaces;
    }

    async updateWorkspace(user: JwtPayload, id: FindOperator<number>, updateWorkspaceDto: UpdateWorkspaceDto): Promise<Workspace> {
        const userWorkSpace: Workspace = await this.workspaceRepository.findOne({
            relations: {
                channels: true,
            },
            where: {
                id,
                user: {
                    id: user.userId,
                },
            },
        });

        if (!userWorkSpace) {
            throw new NotFoundException(ERROR_MESSAGES.WORKSPACE_NOT_FOUND);
        }

        Object.assign(userWorkSpace, updateWorkspaceDto);

        await this.workspaceRepository.save(userWorkSpace);

        return userWorkSpace;
    }

    async deleteWorkspace(user: JwtPayload, id: FindOperator<number>): Promise<string> {
        const userWorkSpace: Workspace = await this.workspaceRepository.findOne({
            relations: {
                channels: true,
            },
            where: {
                id,
                user: {
                    id: user.userId,
                },
            },
        });

        if (!userWorkSpace) {
            throw new NotFoundException(ERROR_MESSAGES.WORKSPACE_NOT_FOUND);
        }

        await this.workspaceRepository.remove(userWorkSpace);

        return RESPONSE_MESSAGES.DELETED;
    }

    async inviteUserToWorkspace(user: JwtPayload, inviteUserDto: InviteUserDto) {
        const { email, workspaceId } = inviteUserDto;

        const workspace = await this.workspaceRepository.findOne({
            where: { id: workspaceId },
            relations: ['user'],
        });

        if (!workspace) {
            throw new NotFoundException(ERROR_MESSAGES.WORKSPACE_NOT_FOUND);
        }

        const sendToUser = await this.userRepository.findOne({ where: { email } });

        if (!sendToUser) {
            throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        const sendFromUser = await this.userRepository.findOne({ where: { id: user.userId } });

        const userFromFullName = sendFromUser.firstName  + ' ' + sendFromUser.lastName;
        await this.mailService.sendInvitationEmail(userFromFullName, sendToUser.email, workspace.name);

        return { message: RESPONSE_MESSAGES.INVITED_TO_WORKSPACE };
    }

}
