import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { log } from 'console';
import { JwtPayload } from 'src/interface';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    console.log(request)
    return user?.sub;
  },
);