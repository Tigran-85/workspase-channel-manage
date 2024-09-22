import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Workspace } from "../workspaces/entities/workspaces.entity";
import {FindOperator, Repository} from "typeorm";
import { User } from "../users/entities/users.entity";
import { JwtPayload } from "../common/interfaces/jwt.interface";
import { CreateChannelDto } from "./dtos/create-channel.dto";
import {ERROR_MESSAGES, RESPONSE_MESSAGES} from "../common/constants/responseMessages.constant";
import {Channel} from "./entities/channels.entity";
import {UpdateChannelDto} from "./dtos/update-channel.dto";

@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,
        @InjectRepository(Workspace)
        private readonly workspaceRepository: Repository<Workspace>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(user: JwtPayload, createChannelDto: CreateChannelDto, workspaceId: FindOperator<number>): Promise<Channel> {
        const existingUser: User = await this.userRepository.findOne({
            where: {
                id: user.userId
            }
        });

        if (!user) {
            throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        const workspace: Workspace = await this.workspaceRepository.findOne({
            where: {
                id: workspaceId,
            }
        });

        if (!workspace) {
            throw new NotFoundException(ERROR_MESSAGES.WORKSPACE_NOT_FOUND);
        }

        const channel: Channel = this.channelRepository.create({
            ...createChannelDto,
            user: existingUser,
            workspace
        });

        await this.channelRepository.save(channel);

        return channel;
    }

    async getChannelById(user: JwtPayload, id: FindOperator<number>): Promise<Channel> {
        const userChannel: Channel = await this.channelRepository.findOne({
            relations: {
                workspace: true,
                user: true
            },
            where: {
                id,
                user: {
                    id: user.userId,
                },
            }
        });

        if(!userChannel) {
            throw new NotFoundException(ERROR_MESSAGES.CHANNEL_NOT_FOUND);
        }

        return userChannel;
    }

    async getChannels(user: JwtPayload): Promise<Channel[]> {
        const channels: Channel[] = await this.channelRepository.find({
            relations: {
                workspace: true,
                user: true
            },
            where: {
                user: {
                    id: user.userId
                }
            }
        });

        return channels;
    }

    async updateChannel(user :JwtPayload, id: FindOperator<number>, updateChannelDto: UpdateChannelDto): Promise<Channel> {
        const userChannel: Channel = await this.channelRepository.findOne({
            relations: {
                workspace: true,
                user: true
            },
            where: {
                id,
                user: {
                    id: user.userId,
                },
            }
        });

        if(!userChannel) {
            throw new NotFoundException(ERROR_MESSAGES.CHANNEL_NOT_FOUND);
        }

        Object.assign(userChannel, updateChannelDto);

        await this.channelRepository.save(userChannel);

        return userChannel;
    }

    async deleteChannel(user: JwtPayload, id: FindOperator<number>): Promise<string> {
        const userChannel: Channel = await this.channelRepository.findOne({
            relations: {
                workspace: true,
                user: true
            },
            where: {
                id,
                user: {
                    id: user.userId,
                },
            }
        });

        if(!userChannel) {
            throw new NotFoundException(ERROR_MESSAGES.CHANNEL_NOT_FOUND);
        }

        await this.channelRepository.remove(userChannel);

        return RESPONSE_MESSAGES.DELETED;
    }
}
