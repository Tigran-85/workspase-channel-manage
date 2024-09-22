import { ConflictException, Controller, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from "./users.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ERROR_MESSAGES } from "../common/constants/responseMessages.constant";
import { AuthGuard } from "../common/guards/jwt.authGuard";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExt = extname(file.originalname);
                const fileName = `${file.originalname.split('.')[0]}-${uniqueSuffix}${fileExt}`;
                cb(null, fileName);
            },
        }),
        limits: {
            fileSize: 1024 * 1024 * 2, // Max file size: 2MB
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return cb(new ConflictException(ERROR_MESSAGES.IMAGE_NOT_ALLOWED), false);
            }
            cb(null, true);
        },
    }))
     uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
        const filePath = `uploads/${file.filename}`;
        const user = req.user;

       return  this.usersService.updateProfileImage(user, filePath);
    }
}
