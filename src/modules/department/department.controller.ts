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
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { CreateDepartImgDto } from './dto/create-departImage.dto';

@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  // Create New Department
  
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Create New Department' })
  @Public()
  @UseGuards(AtGuard)
  @UseGuards(DoesDeptExist)
  @Post('createNewDepartment')
  async create(
    @GetCurrentUserId() userId : string,
    @Body() createDepartmentDto: CreateDepartmentDto
    ) {
    let ErrorCode: number
    try {
      let newDepart = await this.departmentService.create(createDepartmentDto,userId);
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
   async findAll(
    @GetCurrentUserId() userId : string,
    @Query('page') page: number,
     @Query('size') size: number
     ) {
     let ErrorCode: number;
     try {
       let deptData = await this.departmentService?.findAll(
        page,
         size,
         userId
         );
 
       if (deptData?.status_code != HttpStatus.OK) {
         ErrorCode = deptData?.status_code;
         throw new Error(deptData?.message);
       }
       return deptData;
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
  async findOne(
    @GetCurrentUserId() userId : string,
    @Param('departmentId') departmentId: string
    ) {
    let ErrorCode: number
    try {
      let deptData = await this.departmentService.findOne(departmentId,userId);
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
    @GetCurrentUserId() userId : string,
    @Param('departmentId') departmentId: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    let ErrorCode: number
    try {
      let deptUpdate = await this.departmentService.update( departmentId, updateDepartmentDto,userId);
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

    // Update Department Profile Photo
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('defaultBearerAuth')
    @ApiOperation({ summary: 'Update Department Image By departmentId' })
    @Public()
    @UseGuards(AtGuard)
    @Patch(':departmentId/profilePhoto')
    async updateDeptImage(
      @GetCurrentUserId() userId : string,
      @Param('departmentId') departmentId: string,
      @Body() createDepartImageDto:CreateDepartImgDto,
    ) {
      let ErrorCode: number;
      try {
        let dept_update = await this.departmentService.updateDeptImage(
          departmentId,
          createDepartImageDto,
          userId
        );
        if (dept_update?.status_code != HttpStatus.OK) {
          ErrorCode = dept_update?.status_code;
          throw new Error(dept_update?.message);
        }
        return dept_update;
      } catch (error) {
        console.log(error);
        return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
      }
    }

  // Delete Department
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete Department By departmentId' })
  @Public()
  @UseGuards(AtGuard)
  @Delete(':departmentId')
  async remove(
    @GetCurrentUserId() userId : string,
    @Param('departmentId') departmentId: string
    ) {
    let ErrorCode: number
    try {
      let deptRemove = await this.departmentService.remove(departmentId,userId);
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
  async searchDepartment(
    @GetCurrentUserId() userId : string,
    @Query('keyword') keyword: string
    ) {
    let ErrorCode: number
    try {
      let deptSearch = await this?.departmentService?.searchDepartment(
        keyword.charAt(0).toUpperCase(),
        userId
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

  // Bulk Create
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Create Multiple Department' })
  @Public()
  @UseGuards(DoesDeptExist)
  @Post('bulkCreateDepartment/create')
  async bulkCreateDept(
    @Body() createDepartmentDto: CreateDepartmentDto[],
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const dept_data = await this.departmentService?.bulkCreateDept( createDepartmentDto, userId)
      if (dept_data?.status_code != HttpStatus.CREATED) {
        ErrorCode = dept_data?.status_code;
        throw new Error(dept_data?.message)
      }
      return dept_data
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

}
