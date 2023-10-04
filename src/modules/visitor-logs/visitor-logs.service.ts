import { Injectable } from '@nestjs/common';

@Injectable()
export class VisitorLogsService {

  findAll() {
    return `This action returns all visitorLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visitorLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitorLog`;
  }
}
