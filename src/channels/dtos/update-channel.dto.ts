import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './create-channel.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly uniqueSlag: string;
}