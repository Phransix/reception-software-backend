import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Gender } from '../guest/dto/create-guest.dto';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards/at.guard';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { Delivery_type } from '../delivery/dto/create-delivery.dto';
import { visitPurpose } from '../purpose/dto/create-purpose.dto';
import { Purpose } from '../enquiries/dto/create-enquiry.dto';
import * as Util from '../../utils/index'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    name: 'guest',
    enum: Gender,
    required: false
  })
  @ApiQuery({
    name: 'delivery',
    enum: Delivery_type,
    required: false
  })
  @ApiQuery({
    name: 'guestpurpose',
    enum: visitPurpose,
    required: false
  })
  @ApiQuery({
    name: 'enquirypurpose',
    enum: Purpose,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    required: false,
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Analytics of Guest Gender, Guest Purpose, Delivery Type, Enquiry Purpose' })
  @ApiTags('Analytics')
  @Get()
  async getAnalytics (
    @Query('guest') guest: string,
    @Query('delivery') delivery: string,
    @Query('guestpurpose') guestpurpose: string,
    @Query('enquirypurpose') enquirypurpose: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @GetCurrentUserId() userId: string
  ){
    let ErrorCode: number
    try {
      const combinedData = await this.analyticsService.getAllCombinedData(guest,delivery,guestpurpose,enquirypurpose,page,size,userId)
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
