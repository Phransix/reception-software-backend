import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { VisitorLogsService } from './visitor-logs.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import * as Util from '../../utils/index'
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { visitPurpose } from '../purpose/dto/create-purpose.dto';

@Controller('visitor-logs')
export class VisitorLogsController {
  constructor
    (
      private readonly visitorLogsService: VisitorLogsService
    ) { }

  // Bulk Visitlog
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Create Multiple Visitlogs' })
  @Public()
  @ApiTags('Visitor Logs')
  @Post('createVisitlogs')
  async logToDatabase
  (
    @Body() data: any[],
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number

    try {
      const modelName = 'VisitorLog'
      const logsResults = await this.visitorLogsService.saveVisitorLog(modelName, data, userId)
      if (logsResults?.status_code != HttpStatus.CREATED) {
        ErrorCode = logsResults?.status_code;
        throw new Error(logsResults?.message)
      }
      return logsResults
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  // Getting logs for a Guest
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Get All Visitlogs' })
  @Public()
  @ApiTags('Visitor Logs')
  @Get(':guestId')
  async logVisitorInfo
  (
    @Param('guestId') guestId: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number

    try {
      const logsResults = await this.visitorLogsService.getGuestLogs(userId,guestId)
      if (logsResults?.status_code != HttpStatus.OK) {
        ErrorCode = logsResults?.status_code;
        throw new Error(logsResults?.message)
      }
      return logsResults
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

    // Serch and filter by purpose of visit for logs
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('defaultBearerAuth')
    @ApiQuery({
      name: 'keyword',
      enum: visitPurpose,
      required: false
    })
    @Public()
    @UseGuards(AtGuard)
    @ApiTags('Visitor Logs')
    @ApiOperation({ summary: 'Filter Purpose Count For Logs' })
    @Get(':guestId/Purpose')
    async purposeFilterCount(
      @Param('guestId') guestId: string,
      @GetCurrentUserId() userId: string,
      @Query('keyword') keyword: string
    ) {
      let ErrorCode: number
      try {
        const purpose = await this.visitorLogsService.guestPurposeCount(guestId, userId, keyword);
        if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.OK) {
          ErrorCode = purpose?.status_code;
          throw new Error(purpose?.message)
        }
        return purpose
      } catch (error) {
        console.log(error)
        return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
      }
    }

}
