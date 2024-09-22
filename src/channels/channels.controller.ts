import {Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards} from '@nestjs/common';
import { ChannelsService } from "./channels.service";
import { AuthGuard } from "../common/guards/jwt.authGuard";
import { CreateChannelDto } from "./dtos/create-channel.dto";
import { Channel } from "./entities/channels.entity";
import { FindOperator } from "typeorm";
import {UpdateChannelDto} from "./dtos/update-channel.dto";

@Controller('channels')
export class ChannelsController {
    constructor(private readonly channelsService: ChannelsService) {}

    @UseGuards(AuthGuard)
    @Post('create/:id')
    create(@Request() req, @Body() createChannelDto: CreateChannelDto, @Param('id') workspaceId: FindOperator<number>): Promise<Channel> {
        const user = req.user;
        return this.channelsService.create(user, createChannelDto, workspaceId);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    getChannelById (@Request() req, @Param('id') id: FindOperator<number>) {
        const user = req.user;
        return this.channelsService.getChannelById(user, id);
    }

    @UseGuards(AuthGuard)
    @Get()
    getChannels (@Request() req) {
        const user = req.user;
        return this.channelsService.getChannels(user);
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    updateChannel(
        @Request() req,
        @Param('id') id: FindOperator<number>,
        @Body() updateChannelDto: UpdateChannelDto,
    ) {
        const user = req.user;
        return this.channelsService.updateChannel(user, id, updateChannelDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    deleteChannel(
        @Request() req,
        @Param('id') id: FindOperator<number>
    ) {
        const user = req.user;
        return this.channelsService.deleteChannel(user, id);
    }
}
