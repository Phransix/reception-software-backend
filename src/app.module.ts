import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as DB_CONFIGS from 'src/database/config.json';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
// import { APP_GUARD } from '@nestjs/core';
// import { AtGuard } from 'src/common/guards';
import { LoggingInterceptor } from './logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { OrganizationModule } from './modules/organization/organization.module';
import { UsersModule } from './modules/users/users.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { VisitorModule } from './modules/visitor/visitor.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { AppService } from './app.service';



@Module({
  imports: [

    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      },
    }),

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),  

    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          service: 'Gmail',
          host: config.get('MAIL_HOST'),
          // secure: false,
          port: 465,
          ignoreTLS: true,
          secure: true,

          auth: {
            user: config.get('MAIL_USERNAME'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: config.get('MAIL_FROM_ADDRESS')
        },
        template: {
          dir: join(__dirname, 'mails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      
      inject: [ConfigService]
    }),


    SequelizeModule.forRoot({
      dialect: 'postgres',
      ...DB_CONFIGS[process.env.NODE_ENV],
      autoLoadModels: true,
    }),
    VisitorModule,
    DeliveryModule,
    OrganizationModule,
    UsersModule,
    EnquiriesModule,
    
  ],

  controllers: [],
  providers: [

    AppService,
    
    // {
    //   provide: APP_GUARD,
    //   useClass: AtGuard
      
    // },

    {
      provide: APP_INTERCEPTOR,
      useClass:LoggingInterceptor
      
    },
  ],
})
export class AppModule {}
