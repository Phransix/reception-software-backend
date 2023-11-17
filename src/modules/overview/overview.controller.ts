import { Controller, Get,UseGuards, Query, HttpStatus } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards/at.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { daysDto } from './days.dto';
import * as Util from '../../utils/index'
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';

@Controller('overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiQuery({
    name: "days",
    enum: daysDto,
    required: false
  })
  @UseGuards(AtGuard)
  @ApiTags('Overview')
  @ApiOperation({ summary: 'Overview of Active Visits, Total Visits, Enquiries, Deliveries' })
  @Get('dateRange')
  async findAll(
    @Query('days') days : string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode : number
    try {
      const overview = await this.overviewService.getGeneralOverview(days,userId);
      if (overview && 'status_code' in overview && overview.status_code != HttpStatus.OK) {
        ErrorCode = overview?.status_code;
        throw new Error(overview?.message)
      }
      return overview;
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }
  

}
