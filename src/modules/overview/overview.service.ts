import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, } from 'sequelize';
import { Guest } from '../guest/entities/guest.entity';
import { Delivery } from '../delivery/entities/delivery.entity';
import { Enquiry } from '../enquiries/entities/enquiry.entity';


@Injectable()
export class OverviewService {

  constructor (
    @InjectModel(Guest) private guestModel: typeof Guest,
    @InjectModel(Delivery) private deliveryModel: typeof Delivery,
    @InjectModel(Enquiry) private enquiryModel: typeof Enquiry
  ) {}

//   async getOverviewByDateRange(startDate:Date, endDate:Date) {
//     const today = new Date();
//     const dateRanges = {
//       today: [new Date(today), new Date(today)],
//       yesterday: [new Date(today), new Date(today)],
//       last7days: [new Date(today), new Date(today)],
//       lastmonth: [new Date(today), new Date(today)],
//     };

//     if (!( dateRanges)) {
//       throw new Error('Invalid date range');
//     }
// let dataResult = [Guest,Delivery,Enquiry]

//     const overview = this.dataResult.find({
//       where: {
//         createdAt: {
//           [Op.between]: [startDate, endDate],
//         },
//       },
//     });
//     return overview
//   }

async getAllOverview (){
  
}

}
