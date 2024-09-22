import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
    @IsNumber()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly uniqueSlag: string;
}