import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import * as Util from '../../utils/index'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Visitors')
  @ApiOperation({summary:'Create New Visitors'})
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


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Visitors')
  @ApiOperation({summary:'Get All Visitors'})
  @Get('getAllVisitors')
  async findAll() {
    return await this.visitorService.findAll();
  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Visitors')
  @ApiOperation({summary:'Get Visitor By Id'})
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


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Visitors')
  @ApiOperation({summary:'Update Visitor By Id'})
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


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Visitors')
  @ApiOperation({summary:'Remove Visitor By Id'})
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.visitorService.remove(+id);
  }
}
