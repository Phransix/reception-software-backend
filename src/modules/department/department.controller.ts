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
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Create New Department' })
  @Public()
  @UseGuards(AtGuard)
  @UseGuards(DoesDeptExist)
  @Post('createNewDepartment')
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      let newDepart = this.departmentService.create(createDepartmentDto);
      return newDepart;
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error)
      // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
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
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Departments current page cannot be negative',
        );
      }

      const { limit, offset } = Util.getPagination(page, size);

      const allDepts = await Department.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      });

      let result = Util?.getPagingData(allDepts, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Departments Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error)
      // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
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
    try {
      let deptData = await this.departmentService.findOne(departmentId);
      return deptData;
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error)
      // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
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
    try {

      return this.departmentService.update(departmentId, updateDepartmentDto);
      
    } catch (error) {
      console.log(error)
      return Util?.getTryCatchMsg(error)
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
    try {
      
      return this.departmentService.remove(departmentId);

    } catch (error) {
      console.log(error)
      return Util?.getTryCatchMsg(error)
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
    try {
      return this?.departmentService?.searchDepartment(
        keyword.charAt(0).toUpperCase(),
      );
    } catch (error) {
      console.log(error);
      // return Util?.handleFailResponse('No matching Department data found.');
      return Util?.getTryCatchMsg(error)
    }
  }
}
