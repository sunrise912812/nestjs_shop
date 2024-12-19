import { ApiProperty } from '@nestjs/swagger';

export class MakePaymentResponse {
	@ApiProperty({ example: '2d4a91d8' })
	id: string;

	@ApiProperty({ example: 'pending' })
	status: string;

	@ApiProperty({ example: { value: 100, currency: 'RUB' } })
	amount: {
		value: number;
		currency: string;
	};

	@ApiProperty({ example: 'Заказ №1' })
	description: string;

	@ApiProperty({ example: { account_id: '311151', gateway_id: '2179646' } })
	recipient: {
		account_id: string;
		gateway_id: string;
	};

	@ApiProperty({ example: '2024-01-30T04:42:00.967Z' })
	created_at: string;

	@ApiProperty({
		example: {
			type: 'redirect',
			confirmation_url:
				'https://yoomoney.ru/checkout/payments/v2/contract?orderId=1',
		},
	})
	confirmation: {
		type: string;
		confirmation_url: string;
	};

	@ApiProperty({ example: true })
	test: boolean;

	@ApiProperty({ example: false })
	paid: boolean;

	@ApiProperty({ example: false })
	refundable: boolean;

	@ApiProperty({ example: {} })
	metadata: object;
}
