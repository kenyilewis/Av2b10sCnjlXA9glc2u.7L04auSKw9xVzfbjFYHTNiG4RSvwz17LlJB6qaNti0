import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CustomUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const { id } = request.params;
    if (user.userId !== id) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return true;
  }
}
