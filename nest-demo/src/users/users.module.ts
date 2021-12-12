import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, LoggerService],
  controllers: [UsersController],
})
export class UsersModule {}
