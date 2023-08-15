import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Request, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index'
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
<<<<<<< HEAD
=======
import { AuthGuard } from '@nestjs/passport';
import { ChangePassDTO } from 'src/guard/auth/changePassDTO';
// import { comparePassword ,hashPassword} from 'src/passwordhash/generatepasshash'

@ApiTags('Users')
>>>>>>> aa6d0897bd7c6ca8d03c116f5aa87cc7778c1b40

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

<<<<<<< HEAD
  @ApiTags('Users')
=======
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }


>>>>>>> aa6d0897bd7c6ca8d03c116f5aa87cc7778c1b40
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

  
    // change Password
   
    // @Patch(':id/change-password')
    // // @UseGuards(AuthGuard())
    // async changePassword(
    //   @Request()req,
    //   @Body('oldPassword') oldPassword: string,
    //   @Body('newPassword') newPassword: string
    // ){
    //   const userId = req.user.id;
    //   await this.usersService.changePassword(userId,oldPassword,newPassword)
    // }
 
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
