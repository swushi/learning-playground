import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() req: Request) {
    Logger.log(req.url, `${UsersController.name} - ${req.method} ${req.url}`);
    return this.usersService.findAll();
  }

  @Get(':id')
  find(@Param('id') id: User['id']) {
    return this.usersService.find(id);
  }

  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Delete(':id')
  delete(@Param('id') id: User['id']) {
    return this.usersService.remove(id);
  }
}
