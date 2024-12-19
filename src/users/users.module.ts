import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';

@Module({
	imports: [SequelizeModule.forFeature([User])],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService], //Необходимо экспортиовать так как AuthService не видит этот сервис
})
export class UsersModule { }
