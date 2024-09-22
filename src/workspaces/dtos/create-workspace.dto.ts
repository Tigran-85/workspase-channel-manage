import {IsNotEmpty, IsString, MaxLength} from 'class-validator';
import {VALIDATION_ERROR_MESSAGES} from "../../common/constants/responseMessages.constant";

export class CreateWorkspaceDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120, {
        message: VALIDATION_ERROR_MESSAGES.INVALID_WORKSPACE_NAME,
    })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(120, {
        message: VALIDATION_ERROR_MESSAGES.INVALID_SLAG_NAME,
    })
    readonly uniqueSlag: string;
}