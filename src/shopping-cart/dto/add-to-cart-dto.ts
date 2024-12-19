import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class AddToCartDto {
	@ApiProperty({ example: 'Pavel' })
	@IsNotEmpty() //Не может быть пустым
	readonly username: string;

	@ApiProperty({ example: 1 })
	@IsOptional() // Не обязателен для заполнения
	userId?: number;

	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	partId: number;
}