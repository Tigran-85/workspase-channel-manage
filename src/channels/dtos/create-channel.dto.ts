import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import { VALIDATION_ERROR_MESSAGES } from "../../common/constants/responseMessages.constant";

export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120, {
        message: VALIDATION_ERROR_MESSAGES.INVALID_CHANNEL_NAME,
    })
    readonly name: string;
}