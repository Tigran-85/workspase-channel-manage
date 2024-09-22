import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/users.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ERROR_MESSAGES, RESPONSE_MESSAGES } from "../common/constants/responseMessages.constant";
import { JwtPayload } from "../common/interfaces/jwt.interface";
import * as fs from "node:fs";
import * as process from "node:process";

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {}

  async updateProfileImage(user: JwtPayload, filePath: string) {
    const existingUser: User = await this.userRepository.findOne({
      where: {
        id: user.userId
      }
    });

    if (!existingUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (existingUser.profileImage) {
      try {
        fs.unlinkSync(existingUser.profileImage.replace(process.env.API_BASE_URL, ""));
      }catch (e) {
        console.log(e)
      }
    }

    await this.userRepository.update(
        { id: user.userId },
        { profileImage: `${process.env.API_BASE_URL}${filePath}` }
    );

    return {
      message: RESPONSE_MESSAGES.IMAGE_UPLOADED,
    };
  }
}