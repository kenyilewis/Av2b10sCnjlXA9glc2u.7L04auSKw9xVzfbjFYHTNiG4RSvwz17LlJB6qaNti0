import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn(
        `No token provided for ${request.method} ${request.url}`,
      );
      throw new UnauthorizedException('No token provided');
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      this.logger.error(
        `Authentication failed: ${info?.message || 'Unknown error'}`,
      );
      throw (
        err ||
        new UnauthorizedException('Authentication failed')
      );
    }
    return user;
  }

  private extractTokenFromHeader(request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
