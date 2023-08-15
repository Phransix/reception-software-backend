import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index'
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('Users')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
      return this.usersService.remove(id);
      // // await user.remove()

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }

    // 
  }
}
