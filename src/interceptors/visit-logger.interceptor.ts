import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Sequelize } from 'sequelize-typescript';
import { Purpose } from "src/modules/purpose/entities/purpose.entity";
import { VisitorLog } from "src/modules/visitor-logs/entities/visitor-log.entity";

@Injectable()
export class VisitLogger implements NestInterceptor {

    constructor (
        private readonly sequelize: Sequelize
    ) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const purpose: Purpose = request.purpose;

        return next.handle().pipe(
            tap(async () => {
                const visitLog = new VisitorLog();

                if (purpose) {
                    visitLog.purposeId = purpose.purposeId
                }
                console.log(visitLog.purposeId)
                await visitLog.save();
            })
        )
    }
}