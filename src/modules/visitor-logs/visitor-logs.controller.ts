import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { VisitorLogsService } from './visitor-logs.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import * as Util from '../../utils/index'
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';


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
  // async getGuestLogs 

}
