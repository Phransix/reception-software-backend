import { Module } from '@nestjs/common';
import { VisitorLogsService } from './visitor-logs.service';
import { VisitorLogsController } from './visitor-logs.controller';

@Module({
  controllers: [VisitorLogsController],
  providers: [VisitorLogsService]
})
export class VisitorLogsModule {}
