import { MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import Mail from "nodemailer/lib/mailer";


import { Logger } from '@nestjs/common';

@Processor('emailVerification')
export class EmailProcessor{
    private readonly logger = new Logger(EmailProcessor.name);
    constructor (private readonly mailService: MailerService){}
    

    @Process('verify_mail')
    async handleTranscode(job: Job) {
        this.logger.debug('Start transcoding...');
        let details = job.data?.details;
        try {
            await this.mailService.sendMail({
                to: details?.emal,
                subject: 'Account Verification',
                template: './verification',
                context: {
                    email : details?.email,
                    org_name: details?.org_name,
                    link: details?.link,
                    year: details?.year
                }
            })
            this.logger.debug('Transcoding completed');
        } catch (error) {
            console.log(error);
        }

    }
}