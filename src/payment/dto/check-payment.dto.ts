import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CheckPaymentDto {
	@ApiProperty({ example: '2419a771-000f-5000-9000-1edaf29243f2' })
	@IsNotEmpty() //Не может быть пустым
	readonly paymentId: string;
}
