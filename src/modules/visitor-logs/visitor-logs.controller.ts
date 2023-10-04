import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VisitorLogsService } from './visitor-logs.service';

@Controller('visitor-logs')
export class VisitorLogsController {
  constructor(private readonly visitorLogsService: VisitorLogsService) {}

  @Get()
  findAll() {
    return this.visitorLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitorLogsService.findOne(+id);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitorLogsService.remove(+id);
  }
}
