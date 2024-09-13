import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { log } from 'console';
import { getFullTemplatePath } from 'src/mail.module';

@Processor('resetPassword')
export class ResetPasswordProcessor {
  private readonly logger = new Logger(ResetPasswordProcessor.name);
  constructor(private mailService: MailerService) {}

  @Process('reset_password')
  async handleTranscode(job: Job) {
    this.logger.debug('Start trancoding...');
    let details = job.data?.details;

    let mail_path = getFullTemplatePath('ResetPassword');

    try {
      await this.mailService
        .sendMail({
          from: process.env.MAIL_FROM_ADDRESS,
          to: details?.email,
          subject: 'Reset Password Mail',
          template:mail_path,
          context: {
            email: details?.email,
            org_name: details?.org_name,
            link: details?.link,
            year: details?.year,
          },
        })
        .then((r) => {
          console.log(r, 'email is sent');
          this.logger.debug('Transcoding completed');
        })
        .catch((e) => {
          console.log(e, 'error sending email');
          this.logger.debug('Transcoding Failed');
        });
    } catch (error) {
      console.log(error);
    }
  }
}
