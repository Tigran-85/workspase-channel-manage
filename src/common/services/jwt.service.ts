import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JWTService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async comparePasswords(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
  }

  async generateJwt(userId: number): Promise<string> {
    const payload: JwtPayload = { userId };

    return this.jwtService.sign(payload);
  }
}