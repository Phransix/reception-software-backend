import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as Util from '../../utils/index';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
import { Department } from './entities/department.entity';
import { DoesDeptExist } from 'src/common/guards/doesDeptExist.guard';

@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  // Create New Department
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Create New Department' })
  @Public()
  @UseGuards(AtGuard)
  @UseGuards(DoesDeptExist)
  @Post('createNewDepartment')
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    let ErrorCode: number
    try {
      let newDepart = await this.departmentService.create(createDepartmentDto);
      if (newDepart?.status_code != HttpStatus.CREATED) {
        ErrorCode = newDepart?.status_code;
        throw new Error(newDepart?.message)
    } 
      return newDepart;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }


   // Get All Departments
   @UseGuards(AuthGuard('jwt'))
   @ApiBearerAuth('defaultBearerAuth')
   @ApiOperation({ summary: 'Get All Departments' })
   @Public()
   @ApiQuery({
     name: 'page',
     type: 'number',
     required: false,
   })
   @ApiQuery({
     name: 'size',
     type: 'number',
     required: false,
   })
   @UseGuards(AtGuard)
   @Get('getAllDepartments')
   async findAll(@Query('page') page: number, @Query('size') size: number) {
     let ErrorCode: number;
     try {
       let staffData = await this.departmentService?.findAll(page, size);
 
       if (staffData?.status_code != HttpStatus.OK) {
         ErrorCode = staffData?.status_code;
         throw new Error(staffData?.message);
       }
       return staffData;
     } catch (error) {
       console.log(error);
       return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
     }
   }

  // Get One Department
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get Department By departmentId' })
  @Public()
  @UseGuards(AtGuard)
  @Get(':departmentId')
  async findOne(@Param('departmentId') departmentId: string) {
    let ErrorCode: number
    try {
      let deptData = await this.departmentService.findOne(departmentId);
      if (deptData?.status_code != HttpStatus.OK) {
        ErrorCode = deptData?.status_code;
        throw new Error(deptData?.message)
    } 
      return deptData;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Udate Department
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update Department By departmentId' })
  @Public()
  @UseGuards(AtGuard)
  @UseGuards(DoesDeptExist)
  @Patch(':departmentId')
  async update(
    @Param('departmentId') departmentId: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    let ErrorCode: number
    try {
      let deptUpdate = await this.departmentService.update(departmentId, updateDepartmentDto);
      if (deptUpdate?.status_code != HttpStatus.OK) {
        ErrorCode = deptUpdate?.status_code;
        throw new Error(deptUpdate?.message)
    } 
      return deptUpdate
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Delete Department
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete Department By departmentId' })
  @Public()
  @UseGuards(AtGuard)
  @Delete(':departmentId')
  async remove(@Param('departmentId') departmentId: string) {
    let ErrorCode: number
    try {
      let deptRemove = await this.departmentService.remove(departmentId);
      if (deptRemove?.status_code != HttpStatus.OK) {
        ErrorCode = deptRemove?.status_code;
        throw new Error(deptRemove?.message)
    } 
      return deptRemove
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Search Department
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Search Department Data From The System' })
  @Public()
  @ApiQuery({
    name: 'keyword',
    type: 'string',
    required: false,
  })
  @UseGuards(AtGuard)
  @Get('department/search')
  async searchDepartment(@Query('keyword') keyword: string) {
    let ErrorCode: number
    try {
      let deptSearch = await this?.departmentService?.searchDepartment(
        keyword.charAt(0).toUpperCase(),
      );
      if (deptSearch?.status_code != HttpStatus.OK) {
        ErrorCode = deptSearch?.status_code;
        throw new Error(deptSearch?.message)
    } 
      return deptSearch
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }
}
