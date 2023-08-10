import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  async sendMail({ email, lastName, setToken }): Promise<void> {
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'kemiqals93@gmail.com',
        pass: 'eblpxsjwormgdjld',
      },
    });

    const mailOptions = {
      from: 'Albert <kemiqalsdemo93@gmail.com>',
      to: email,
      subject: 'Testing My Nodemailer',
      text: `Hello, ${lastName} Please verify your email by clicking this link:\n
        http://localhost:3000/user/verify-email/${setToken}\n
        Hello ${lastName}, Thanks for registering with Us`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.log(error);
    }
  }
}
