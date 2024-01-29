import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { VisitorPerfomanceService } from './visitor-perfomance.service';
import { MONTHS, filter } from './months.DTO';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import * as Util from '../../utils/index';

@Controller('visitor-perfomance')
export class VisitorPerfomanceController {
  constructor(
    private readonly visitorPerfomanceService: VisitorPerfomanceService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiQuery({
    name: 'filter',
    enum: filter,
    required: false,
  })
  @UseGuards(AtGuard)
  @ApiTags('Visitor Performance')
  @ApiOperation({ summary: 'Visitor Performance ' })
  @Get('dateRange')
  async findAll(
    @Query('filter') filter: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number;
    try {
      const overview =
        await this?.visitorPerfomanceService?.getVisitorPerformance(
          filter,
          userId
        );
      if (
        overview &&
        'status_code' in overview &&
        overview.status_code != HttpStatus.OK
      ) {
        ErrorCode = overview?.status_code;
        throw new Error(overview?.message);
      }
      return overview;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

 
}
