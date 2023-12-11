import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as Util from '../../utils/index'
import { AtGuard } from 'src/common/guards';
import { AuthGuard } from '@nestjs/passport';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  // Bulk Purpose
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Create Multiple Notifications' })
  @Public()
  @ApiTags('Notification')
  @Post('bulkNotificationsCreate/create')
  async buklCreatePurpose(
    @Body() createNotificationDto: CreateNotificationDto[],
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const modelName = 'Notification'
      const notificationsResults = await this.notificationService.bulkNotification(createNotificationDto, userId)
      if (notificationsResults?.status_code != HttpStatus.CREATED) {
        ErrorCode = notificationsResults?.status_code;
        throw new Error(notificationsResults?.message)
      }
      return notificationsResults
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  // Get all Notifications
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Notification')
  @ApiOperation({ summary: 'Get Notifications' })
  @Get('getAllNotification')
  async findAllNotification(
    @GetCurrentUserId() userId: string
  ) {

    let ErrorCode: number;
    try {

      let getNotifications = await this.notificationService.findAll(userId);

      if (getNotifications && 'status_code' in getNotifications && getNotifications.status_code !== HttpStatus.OK) {
        ErrorCode = getNotifications?.status_code;
        throw new Error(getNotifications?.message)
      }
      return getNotifications;

    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }

  }


  // Get Notification by notificationId
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Notification')
  @ApiOperation({ summary: 'Get Notificatoion By notificationId' })
  @Get(':notificationId')
  async findOne(
    @Param('notificationId') notificationId: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      let notification = await this.notificationService.findOne(notificationId, userId);
      if (notification?.status_code != HttpStatus.OK) {
        ErrorCode = notification?.status_code;
        throw new Error(notification?.message)
      }
      return notification;

    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }


  // Update notification status
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
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const notification = await this.notificationService.updateStatus(notificationId, userId)
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

  // Delete notification
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
