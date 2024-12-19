import { ApiProperty } from '@nestjs/swagger';

class ShoppingCart {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: 1 })
	userId: number;

	@ApiProperty({ example: 1 })
	partId: number;

	@ApiProperty({ example: 'Zanussi' })
	boiler_manufacturer: string;

	@ApiProperty({ example: 714 })
	price: number;

	@ApiProperty({ example: 'Sensor' })
	parts_manufacturer: string;

	@ApiProperty({ example: 'Bestia ocer.' })
	name: string;

	@ApiProperty({ example: 'https://loremflickr.com/640/480/technics?random=132947122880294964101198486087' })
	image: string;

	@ApiProperty({ example: 1 })
	in_stock: number;

	@ApiProperty({ example: 1 })
	count: number;

	@ApiProperty({ example: 714 })
	total_price: number;

	@ApiProperty({ example: '2024-01-25T04:56:07.000Z' })
	createdAt: string;

	@ApiProperty({ example: '2024-01-25T04:56:07.000Z' })
	updatedAt: string;
}

export class GetAllResponse extends ShoppingCart { }

export class AddToCartResponse extends ShoppingCart { }

export class UpdateCountResponse {
	@ApiProperty({ example: 1 })
	count: number;
}

export class UpdateCountRequest {
	@ApiProperty({ example: 1 })
	count: number;
}

export class UpdateTotalPriceResponse {
	@ApiProperty({ example: 714 })
	total_price: number;
}

export class UpdateTotalPriceRequest {
	@ApiProperty({ example: 714 })
	total_price: number;
}

