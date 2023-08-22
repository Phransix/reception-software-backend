import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import * as Util from 'src/utils/index'






export class ResetPasswordService {
    constructor(
        @InjectQueue('resetPassword') private readonly resetPasswordQueue: Queue
    ){}


        
    async sendResstPasswordNotification(props) {
        let {userId,email} =props
        try {
            let token = Util.reseetpassToken({ email,userId });
            let details = {
                email,
                link: process.env.RESET_PASSWORD_LINK + '/'+ token,
                year: new Date().getFullYear(),

            }
            return await this.resetPasswordQueue.add(
                'reset_password',
                {
                    details,
                },
                { delay: 1000 },
            );

        } catch (error) {

        }
    }


}