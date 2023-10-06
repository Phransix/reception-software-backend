import { Controller, Post } from '@nestjs/common';
import { VisitorLogsService } from './visitor-logs.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('visitor-logs')
export class VisitorLogsController {
  constructor(private readonly visitorLogsService: VisitorLogsService) {}
  @ApiTags('Visitor Logs')
  @Post()
  async logToDatabase() {
    return this.visitorLogsService.saveVisitorLog();
  }
}
