import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  findAll(@Req() req: Request) {
    this.logger.logRequest('', UsersController.name, req);
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
