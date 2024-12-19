import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Op } from 'sequelize';

class BoilerParts {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: faker.lorem.sentence(2) })
	boiler_manufacturer: string;

	@ApiProperty({ example: 1234 })
	price: number;

	@ApiProperty({ example: faker.lorem.sentence(2) })
	parts_manufacturer: string;

	@ApiProperty({ example: faker.internet.password() })
	vender_code: string;

	@ApiProperty({ example: faker.lorem.word() })
	name: string;

	@ApiProperty({ example: faker.lorem.sentence() })
	description: string;

	@ApiProperty({
		example: JSON.stringify(
			[...Array(7)].map(
				() => `${faker.image.technics()}?random=${faker.random.numeric(30)}`,
			),
		),
	})
	images: string;

	@ApiProperty({ example: 5 })
	in_stock: number;

	@ApiProperty({ example: false })
	bestsellers: boolean;

	@ApiProperty({ example: false })
	new: boolean;

	@ApiProperty({ example: 123 })
	popularity: number;

	@ApiProperty({ example: faker.lorem.sentence() })
	compatibility: string;

	@ApiProperty({ example: '2024-01-19T06:01:40.000Z' })
	createdAt: string;

	@ApiProperty({ example: '2024-01-19T06:01:40.000Z' })
	updatedAt: string;
}

export class PaginateAndFilterResponse {
	@ApiProperty({ example: 10 })
	count: number;

	@ApiProperty({ type: BoilerParts, isArray: true }) //isArray : true - нужно для того чтобы указать что вернет массив объектов
	rows: BoilerParts[];
}

export class Bestsellers extends BoilerParts {
	@ApiProperty({ example: true })
	bestsellers: boolean;
}

export class GetBestsellersResponse extends PaginateAndFilterResponse {
	//Наследуем класс PaginateAndFilterResponse и ставим для поля bestsellers значение true.
	@ApiProperty({ example: 10 })
	count: number;

	@ApiProperty({ type: Bestsellers, isArray: true })
	rows: Bestsellers[];
}

export class NewParts extends BoilerParts {
	@ApiProperty({ example: true })
	new: boolean;
}

export class GetNewResponse extends PaginateAndFilterResponse {
	@ApiProperty({ example: 10 })
	count: number;

	@ApiProperty({ type: NewParts, isArray: true })
	rows: NewParts[];
}

export class SearchByLetterResponse extends BoilerParts {
	@ApiProperty({ example: 'Theologus comptus.' })
	name: string;
}

export class SearchResponse extends PaginateAndFilterResponse {
	@ApiProperty({ type: SearchByLetterResponse, isArray: true })
	rows: SearchByLetterResponse[];
}

export class SearchRequest {
	@ApiProperty({ example: 'l' })
	search: string;
}

export class GetByNameResponse extends BoilerParts {
	@ApiProperty({ example: 'Theologus comptus.' })
	name: string;
}

export class GetByNameRequest {
	@ApiProperty({ example: 'Theologus comptus.' })
	name: string;
}

export class FindOneResponse extends BoilerParts { }

export interface iBoilerPartsQuery {
	limit: string;
	offset: string;
	boiler: string | undefined;
	parts: string | undefined;
	priceFrom: string | undefined;
	priceTo: string | undefined;
}

export interface iBoilerPartsFilter {
	boiler_manufacturer: string | undefined;
	parts_manufacturer: string | undefined;
	price: { [Op.between]: number[] };
}
