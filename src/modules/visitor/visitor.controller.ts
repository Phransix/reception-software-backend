import { Controller, Get, Post, Body, Patch, Param, Delete, NotAcceptableException, Put } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import * as Util from '../../utils/index'
import { ApiTags } from '@nestjs/swagger';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}
  @ApiTags('Visitors')
  @Post('registerVisitor')
  async registerVisitor(@Body() createVisitorDto: CreateVisitorDto) {
    try {
      let new_Visitor = this.visitorService.create(createVisitorDto);
      return new_Visitor;
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @ApiTags('Visitors')
  @Get('getAllVisitors')
  async findAll() {
    return await this.visitorService.findAll();
  }

  @ApiTags('Visitors')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
    const visitor = await this.visitorService.findOne(id);
    return visitor;
    } catch (error) {
      console.log(error);
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @ApiTags('Visitors')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateVisitorDto: UpdateVisitorDto) {
    // return this.visitorService.update(+id, updateVisitorDto);
    try {
      const visitor_Update = this.visitorService.update(id,updateVisitorDto)
      return visitor_Update
    } catch (error) {
      console.log(error);
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @ApiTags('Visitors')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.visitorService.remove(+id);
  }
}
