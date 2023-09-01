import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as Util from '../../utils/index'
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';



@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Create New Department'})
  @Public()
  @UseGuards(AtGuard)
  @Post('createNewDepartment')
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      let newDepart = this.departmentService.create(createDepartmentDto);
      return newDepart
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  
  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get All Departments'})
  @Public()
  @UseGuards(AtGuard)
  @Get('getAllDepartments')
  async findAll() {

    try {

      const allDepts = this.departmentService.findAll();
      return allDepts
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }

    
  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get Department By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      let deptData = await this.departmentService.findOne(id)
      return deptData 
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
    
  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update Department By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(id, updateDepartmentDto);
  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Delete Department By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
