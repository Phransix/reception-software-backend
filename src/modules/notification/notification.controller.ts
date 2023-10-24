import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as Util from '../../utils/index'
import { AtGuard } from 'src/common/guards';
import { AuthGuard } from '@nestjs/passport';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Notification')
  @Public()
  @ApiOperation({ summary: 'Create New Notifcation' })
  @Post('createNotification')
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @GetCurrentUserId() userId: string,
    ) {
   let ErrorCode: number

   try {
    
    let createNotification = await this.notificationService.create(createNotificationDto, userId);
    if (createNotification && 'status_code' in createNotification && createNotification.status_code !== HttpStatus.CREATED) {
      ErrorCode = createNotification?.status_code;
      throw new Error(createNotification?.message)
    }
    return createNotification
   } catch (error) {
    console.log(error)
    return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
   }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Notification')
  @ApiOperation({ summary: 'Get Notificaions' })
  @Get('getAllNotification')
  async findAllNotification(
    @GetCurrentUserId() userId?: string
  ) {

    let ErrorCode: number;
    try {
      
      let getNotifications = await this.notificationService.findAll(userId);
      if (getNotifications && 'status_code' in getNotifications && getNotifications.status_code !== HttpStatus.OK) {
        ErrorCode = getNotifications?.status_code;
        throw new Error(getNotifications?.message)
      }
      return getNotifications

    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }

  }


  @Public()
  @ApiTags('Notification')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Update Notification By notificationId' })
  @Patch(':notificationId')
  async update(
    @Param('notificationId') notificationId: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const notification = await this.notificationService.update(notificationId, updateNotificationDto, userId)
      if (notification && 'status_code' in notification && notification.status_code !== HttpStatus.OK) {
        ErrorCode = notification?.status_code;
        throw new Error(notification?.message)
      }
      return notification
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  @Public()
  @ApiTags('Notification')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Remove Notification By notificationId' })
  @Delete(':notificationId')
  async remove(
    @Param('notificationId') notificationId: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const notification = await this.notificationService.remove(notificationId, userId);
      if (notification && 'status_code' in notification && notification.status_code !== HttpStatus.OK) {
        ErrorCode = notification?.status_code;
        throw new Error(notification?.message)
      }
      return notification
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }
}
