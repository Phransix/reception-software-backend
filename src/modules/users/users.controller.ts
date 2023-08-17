import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Request, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index'
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { ChangePassDTO } from 'src/guard/auth/changePassDTO';
import { LoginDTO } from 'src/guard/auth/loginDTO';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


    // Register New User
  @ApiTags('Users')
  @Post('registerNewUser')
  async createDelivery(@Body()  createUserDto: CreateUserDto) {
    try {
      let new_user = this.usersService.create(createUserDto);
      return new_user;
    } catch (error) {
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  // Login Users
  @ApiTags('Users')
  @Post('login')
  async login(@Body() loginDto: LoginDTO){
    const user = await this.usersService.validateUser(loginDto);
    if (!user){
      throw new HttpException('Invalid Credentials',HttpStatus.UNAUTHORIZED)
    }else{
      // throw new HttpException('Login Successfully',HttpStatus.ACCEPTED)
      return user
    }
  }

  @ApiTags('Users')
  @Get('getAllUsers')
  async findAll() {

    try {
      const allQueries = this.usersService.findAll()
      return allQueries;

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }

  };


  @ApiTags('Users')
  @Get(':id')
  async findOne(@Param('id') id: number) {

    try{

      let userData = await this.usersService.findOne(id);
        return userData
      

    }catch(error){
      console.log(error)
      return Util?.getTryCatchMsg(Util?.getTryCatchMsg(error))
    }
  };


  @ApiTags('Users')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {

    try {

      const userUpdate = await this.usersService.update(id, updateUserDto)
      return userUpdate

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }

  };

  @ApiTags('Users')
  @Delete(':id')
  async remove(@Param('id') id: number) {

    try{

      const user = await User.findOne({where:{id}});
      if(!user) {
        throw new Error('User not Found')
      }

      // return this.usersService.remove(id);

      Object.assign(user)
      // return this.usersService.remove(id);
      await user.destroy()

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }

  }
     
  @ApiTags('Users')
    @Patch(':id/changePassword')
    async changePassword(@Param('id') id: number,@Body() changePassDTO: ChangePassDTO) {
      try {
        const userPass = await this.usersService.changePass(id, changePassDTO)
        return userPass
        // console.log(userPass)
      } catch (error) {
        console.log(error)
        return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
      }
     
    }







}
