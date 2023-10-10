import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as DB_CONFIGS from 'src/database/config.json';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { LoggingInterceptor } from './logging.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { OrganizationModule } from './modules/organization/organization.module';
import { UsersModule } from './modules/users/users.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { AppService } from './app.service';
import { RoleModule } from './modules/role/role.module';
import { RolesGuard } from './common/guards/roles.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'
import { AppController } from './app.controller';
import { UsersService } from './modules/users/users.service';
import { Role } from './modules/role/entities/role.entity';
import { Organization } from './modules/organization/entities/organization.entity';
import { User } from './modules/users/entities/user.entity';
import { GuestModule } from './modules/guest/guest.module';
import { AtGuard } from './common/guards';
import { DepartmentModule } from './modules/department/department.module';
import { StaffModule } from './modules/staff/staff.module';
import { AuthPassService } from './guard/auth/authPass.service';
import { PasswordService } from './guard/passwordhash.service';
import { PurposeModule } from './modules/purpose/purpose.module';
import { MulterModule } from '@nestjs/platform-express';
import { imageUploadProfile } from './helper/usersProfile';
import { staffImageUploadProfile } from './helper/staffProfiles';
import { orgImageUploadProfile } from './helper/organizationsProfile';
import { ResetPasswordService } from './helper/ResetPassHelper';
import { OverviewModule } from './modules/overview/overview.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { VisitorPerfomanceModule } from './modules/visitor-perfomance/visitor-perfomance.module';
// import { VisitorLogsModule } from './modules/visitor-logs/visitor-logs.module';
// import { VisitorLog } from './modules/visitor-logs/entities/visitor-log.entity';
// import { VisitLogger } from './interceptors/visit-logger.interceptor';



@Module({
  imports: [
    SequelizeModule.forFeature([User,Role,Organization]),
    BullModule.registerQueue({name:'resetPassword'}),

   
    PassportModule,
    JwtModule.register({secret:process.env.jWT_ACCESS_SECRET, signOptions: {expiresIn:'5hrs'}}),

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
    DeliveryModule,
    OrganizationModule,
    UsersModule,
    EnquiriesModule,
    RoleModule,
    GuestModule,
    DepartmentModule,
    StaffModule,
    PurposeModule,
    OverviewModule,
    AnalyticsModule,
    VisitorPerfomanceModule,
    // VisitorLogsModule,
  ],

  controllers: [AppController],
  providers: [
   
    
   
    UsersService,
    AuthPassService,
    PasswordService,
    imageUploadProfile,
    staffImageUploadProfile,
    orgImageUploadProfile,
    AppService,
    ResetPasswordService,

     {
      provide: APP_GUARD,
      useClass: RolesGuard
     },

    {
      provide: APP_INTERCEPTOR,
      useClass:LoggingInterceptor
      
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },

    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: VisitLogger,
    // },
    
  ],
})
export class AppModule {}
