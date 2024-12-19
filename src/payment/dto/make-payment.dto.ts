import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class MakePaymentDto {
	@ApiProperty({ example: 1000 })
	@IsNotEmpty() //Не может быть пустым
	readonly amount: number;

	@ApiProperty({ example: 'Заказа №1' })
	@IsOptional() //Проверяет, является ли заданное значение пустым (=== null, === undefined), и если да, игнорирует все валидаторы свойства.
	readonly description?: string;
}
