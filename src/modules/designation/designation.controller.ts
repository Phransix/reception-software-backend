import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as Util from '../../utils/index';
import { DoesDesigtExist } from 'src/common/guards/doesDesigExist.guard';


@ApiTags('Designation')
@Controller('designation')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

   // Create New Designation
   @UseGuards(AuthGuard('jwt'))
   @ApiBearerAuth('defaultBearerAuth')
   @ApiOperation({ summary: 'Create New Designation' })
   @Public()
   @UseGuards(AtGuard)
   @UseGuards(DoesDesigtExist)
   @Post('createNewDesignation')
   async create(
     @GetCurrentUserId() userId: string,
     @Body() createDesignationDto: CreateDesignationDto,
   ) {
     let ErrorCode: number;
     try {
       let new_data = await this.designationService.create(createDesignationDto, userId);
       if (new_data?.status_code != HttpStatus.CREATED) {
         ErrorCode = new_data?.status_code;
         throw new Error(new_data?.message);
       }
       return new_data;
     } catch (error) {
       console.log(error);
       return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
     }
   }

 
    // Get All Designation
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get All Designation' })
  @Public()
  @UseGuards(AtGuard)
  @Get('getAllDesignation')
  async findAll(
    @GetCurrentUserId() userId: string,
  ) {
    let ErrorCode: number;
    try {
      let desgData = await this.designationService?.findAll(userId);

      if (desgData?.status_code != HttpStatus.OK) {
        ErrorCode = desgData?.status_code;
        throw new Error(desgData?.message);
      }
      return desgData;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }


  // Update Designation By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update Designation By staffId' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':designationId')
  async update(
    @GetCurrentUserId() userId: string,
    @Param('designationId') designationId: string,
    @Body() updateDesignationDto: UpdateDesignationDto,
  ) {
    let ErrorCode: number;
    try {
      let desg_update = await this.designationService.update(
        designationId,
        updateDesignationDto,
        userId,
      );
      if (desg_update?.status_code != HttpStatus.OK) {
        ErrorCode = desg_update?.status_code;
        throw new Error(desg_update?.message);
      }
      return desg_update;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Delete Designation By The esignationId
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete Designation By designationId' })
  @Public()
  @UseGuards(AtGuard)
  @Delete(':designationId')
  async remove(
    @GetCurrentUserId() userId: string,
    @Param('designationId') designationId: string,
  ) {
    let ErrorCode: number;
    try {
      let desg_delete = await this.designationService.remove(designationId, userId);
      if (desg_delete?.status_code != HttpStatus.OK) {
        ErrorCode = desg_delete?.status_code;
        throw new Error(desg_delete?.message);
      }
      return desg_delete;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  


 
}
