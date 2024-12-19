import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ example: 'Pavel' }) //Необходим для работы правильного описания api
	@IsNotEmpty()
	readonly username: string;

	@ApiProperty({ example: 'Pavel123' }) //Необходим для работы правильного описания api
	@IsNotEmpty()
	readonly password: string;

	@ApiProperty({ example: 'pavel@mail.ru' }) //Необходим для работы правильного описания api
	@IsNotEmpty()
	readonly email: string;
}