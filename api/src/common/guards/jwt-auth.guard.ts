import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  // You can add any custom logic here if needed
  canActivate(context: ExecutionContext) {
    // Custom logic before the default behavior
    return super.canActivate(context);
  }
}
