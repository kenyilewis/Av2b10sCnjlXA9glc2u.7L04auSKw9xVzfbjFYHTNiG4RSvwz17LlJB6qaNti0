import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWTPayload } from '../dto/login.dto';
import { UserService } from '../../user/application/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('config.jwt.secret'),
    });
  }

  async validate(payload: JWTPayload) {
    const { userId, email } = payload;
    if (!userId || !email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { userId, email };
  }
}
