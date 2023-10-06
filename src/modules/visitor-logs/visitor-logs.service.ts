import { Injectable } from '@nestjs/common';

@Injectable()
export class VisitorLogsService {

  async saveVisitorLog() {
    return `This action returns all visitorLogs`;
  }

  async logResponseToDatabase() {
    return `This action returns all visitorLogs`;
  }

}
