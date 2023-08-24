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
import { VisitorModule } from './modules/visitor/visitor.module';
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




@Module({
  imports: [

    // PaginateModule.forRoot({
    //   url: 'http://localhost:3005',
    // }),
    SequelizeModule.forFeature([User,Role,Organization]),

   
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
    VisitorModule,
    DeliveryModule,
    OrganizationModule,
    UsersModule,
    EnquiriesModule,

   
    RoleModule,
    GuestModule,
    DepartmentModule,
    StaffModule,
    
  ],

  controllers: [AppController],
  providers: [
   
    
   
    UsersService,

    AppService,

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

  ],
})
export class AppModule {}
