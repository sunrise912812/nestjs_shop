import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BoilerParts } from './boiler-parts.model';
import { Op } from 'sequelize';
import { iBoilerPartsFilter, iBoilerPartsQuery } from './types';

@Injectable()
export class BoilerPartsService {
	constructor(
		@InjectModel(BoilerParts) private boilerPartsModel: typeof BoilerParts,
	) { }

	async paginateAndFilter(
		query: iBoilerPartsQuery,
	): Promise<{ count: number; rows: BoilerParts[] }> {
		const limit = +query.limit;
		const offset = +query.offset * 20; //Будем возвращать по 20 записей.
		const filter = {} as Partial<iBoilerPartsFilter>; //Partial - Создает тип со всеми свойствами Type, установленными как необязательные. Эта утилита вернет тип, который представляет все подмножества данного типа.
		if (query.priceFrom && query.priceTo) {
			filter.price = {
				[Op.between]: [+query.priceFrom, +query.priceTo],
			};
		}
		if (query.boiler) {
			filter.boiler_manufacturer = JSON.parse(decodeURIComponent(query.boiler));
		}
		if (query.parts) {
			filter.parts_manufacturer = JSON.parse(decodeURIComponent(query.parts));
		}
		return this.boilerPartsModel.findAndCountAll({
			limit,
			offset,
			where: filter,
		});
	}

	async bestsellers(): Promise<{ count: number; rows: BoilerParts[] }> {
		return this.boilerPartsModel.findAndCountAll({
			where: { bestsellers: true },
		});
	}

	async new(): Promise<{ count: number; rows: BoilerParts[] }> {
		return this.boilerPartsModel.findAndCountAll({
			where: { new: true },
		});
	}

	async findOne(id: number | string): Promise<BoilerParts> {
		return this.boilerPartsModel.findOne({
			where: { id },
		});
	}

	async findOneByName(name: string): Promise<BoilerParts> {
		return this.boilerPartsModel.findOne({
			where: { name },
		});
	}

	async searchByString(
		str: string,
	): Promise<{ count: number; rows: BoilerParts[] }> {
		return this.boilerPartsModel.findAndCountAll({
			limit: 20,
			where: {
				name: { [Op.like]: `%${str}%` },
			},
		});
	}
}
