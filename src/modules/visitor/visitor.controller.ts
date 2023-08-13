import { Controller, Get, Post, Body, Patch, Param, Delete, NotAcceptableException, Put } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import * as Util from '../../utils/index'

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

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

  @Get()
  async findAll() {
    return await this.visitorService.findAll();
  }

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

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateVisitorDto: UpdateVisitorDto): Promise<string | void> {
    // return this.visitorService.update(+id, updateVisitorDto);
    try {
      let visitor_Update = this.visitorService.update(+id,updateVisitorDto)
      return visitor_Update
    } catch (error) {
      console.log(error);
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitorService.remove(+id);
  }
}
