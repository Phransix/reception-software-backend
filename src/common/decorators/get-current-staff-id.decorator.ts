import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { log } from 'console';
import { JwtPayload } from 'src/interface';

export const GetCurrentStaffId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const staff = request.staff as JwtPayload;
    console.log(request)
    return staff?.sub;
  },
);