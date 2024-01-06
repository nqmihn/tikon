import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';
import { Public } from 'src/decorators/customize';
import { IQuery } from './user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto)
  }
  @Put()
  update(@Body() userDto: UpdateUserDto) {
    return this.userService.update(userDto)
  }
  @Delete()
  delete(@Body('_id') _id: string) {
    return this.userService.delete(_id)
  }
  @Get()
  getUserWithPaginate(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() search: IQuery) {
    return this.userService.findAllWithPaginate(+current, +pageSize, search)
  }
  @Get(":_id")
  getUserById(@Param('_id') _id: string) {
    return this.userService.findById(_id)
  }
  @Post('bulk')
  @Public()
  createMany(@Body() userDto: CreateUserDto[]) {

    return this.userService.createMany(userDto)
  }
}
