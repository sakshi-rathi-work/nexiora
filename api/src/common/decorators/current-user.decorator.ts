import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class JwtPayload {
  sub!: string;
  email!: string;
  role!: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // req.user is set by JwtStrategy after token validation
    return request.user as JwtPayload;
  },
);
