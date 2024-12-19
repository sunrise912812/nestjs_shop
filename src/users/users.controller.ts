import { Controller, HttpCode, HttpStatus, Header, Body, Post, Request, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { LogOutUserResponse, LoginCheckResponse, LoginUserRequest, LoginUserResponse, SignupResponse } from './types';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) { }

	@ApiOkResponse({ type: SignupResponse })
	@Post('/signup')
	@HttpCode(HttpStatus.CREATED)
	@Header('Content-type', 'application/json')
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@ApiBody({ type: LoginUserRequest }) //Укажем что придет с frontednd
	@ApiOkResponse({ type: LoginUserResponse }) //Укажем что отправим на frontend
	@Post('/login')
	@UseGuards(LocalAuthGuard) // Проверяем валидность пользователя (по логину и паролю авторизуемся)
	@HttpCode(HttpStatus.OK)
	login(@Request() req) {
		return { user: req.user, msg: 'Logged in' };
	}

	@ApiOkResponse({ type: LoginCheckResponse })
	@Get('/login-check')
	@UseGuards(AuthenticatedGuard) // Проверяем зарегистрирован пользователь или нет
	loginCheck(@Request() req) {
		return req.user;
	}

	@ApiOkResponse({ type: LogOutUserResponse })
	@Get('/logout')
	logout(@Request() req) {
		req.session.destroy(); //Уничтожаем сессию, делает выход
		return {
			msg: 'session has ended'
		};
	}
}
