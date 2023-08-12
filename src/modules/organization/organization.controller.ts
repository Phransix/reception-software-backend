import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Res,HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DoesUserExist } from 'src/common/guards/doesUserExist.guard';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Organization } from './entities/organization.entity';
import { MailerService } from '@nestjs-modules/mailer';
// import { MailService } from 'src/mail/mail.service';
import { createEmailToken } from 'src/utils';


 
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    // private readonly mailerSevice: MailerService
  ) {}

 @ApiTags('Organization')
  @ApiOkResponse({
    description:'Registration Successfully',
    type: Organization
  })
  @ApiBadRequestResponse({
    description: 'Registration Failed',
    type: Organization
  })
  @UseGuards(DoesUserExist)
  @Post('signUp')
   async signUp(@Body() createOrganizationDto: CreateOrganizationDto, @Res() res: Response) {
   try {
    const { organization_Name, email,phoneNumber } = createOrganizationDto

    const organization = await this.organizationService.signUp({
      organization_Name,email,phoneNumber
    });


    // const mail = {
    //   to: organization.email,
    //   from:'noreply@application.com',
    //   subject: 'Email de confirmação',
    //     template: 'email-confirmation',
    //     context: {}
    // }
    //  await this.mailerSevice.sendMail(mail)

    if (organization){
      // this.organizationService.sendVerificationEmail(organization)

      return res.status(HttpStatus.CREATED).send({
          status: 'success',
          message: 'Organization registered successfully',
        });

    } else {
      return res.status(HttpStatus.CONFLICT).send({
          status: 'error',
          message: 'Organization already exists',
        });
    }

  }
  catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ status: 'error', message: 'Organization registration failed' });
    }
}



  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }
}
