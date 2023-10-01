import { Controller, Get, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards/at.guard';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import * as Util from '../../utils/index'
import { analyticsDto } from './analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    name: 'analytics',
    enum: analyticsDto,
    required: false
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Analytics of Guest Gender, Guest Purpose, Delivery Type, Enquiry Purpose' })
  @ApiTags('Analytics')
  @Get()
  async getAnalytics (
    @Query('analytics') analytics,
    @GetCurrentUserId() userId: string
  ){
    let ErrorCode: number
    try {
      const combinedData = await this.analyticsService.getAllCombinedData(analytics,userId)
      if (combinedData && 'status_code' in combinedData && combinedData.status_code != HttpStatus.OK) {
        ErrorCode = combinedData?.status_code;
        throw new Error(combinedData?.message)
      }
      return combinedData
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }



}



