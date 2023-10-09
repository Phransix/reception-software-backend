// import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
// import { Observable, tap } from "rxjs";
// import { Sequelize } from 'sequelize-typescript';
// import { Purpose } from "src/modules/purpose/entities/purpose.entity";
// import { VisitorLog } from "src/modules/visitor-logs/entities/visitor-log.entity";

// @Injectable()
// export class VisitLogger implements NestInterceptor {

//     constructor (
//         // @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
//         private readonly sequelize: Sequelize
//     ) {}

//     intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
//         // const myModel = this.sequelize.model(Purpose);
//         const request = context.switchToHttp().getRequest();
//         const purpose = request.purpose;
//         // const guest = request.guest;

//         return next.handle().pipe(
//             tap(async () => {
//                 const visitLog = new VisitorLog();

//                 // visitLog.guestId,
//                 visitLog.purposeId

//                 if (purpose) {
//                     // visitLog.guestId = guest.guestId
//                     visitLog.purposeId = purpose.purposeId
//                 }
//                 await visitLog.save();
//             })
//         )
//     }
// }

  
