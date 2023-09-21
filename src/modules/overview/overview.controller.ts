import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}


  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  // @Public()
  // @UseGuards(AtGuard)
  // @ApiQuery({
  //   name: "page",
  //   type: Number,
  //   required: false
  // })
  // @UseGuards(AtGuard)
  // @ApiTags('Overview')
  // @ApiOperation({ summary: 'Get Overview By Pagination' })
  // @Get('by-date/:dateRange')
  // async findAll(
  // @Query('startDate') startDate: Date,
  // @Query('endDate') endDate: Date,
  // ) {
  //   try {
  //     const orders = await this.overviewService.getOverviewByDateRange(startDate,endDate);
  //     return orders;
  //   } catch (error) {
  //     // Handle the error (e.g., return an error response)
  //     return { error: error.message };
  //   }
  // }

}
