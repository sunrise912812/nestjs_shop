import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ShoppingCart } from './shopping-cart.model';
import { UsersService } from 'src/users/users.service';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service';
import { AddToCartDto } from './dto/add-to-cart-dto';

@Injectable()
export class ShoppingCartService {
	constructor(
		@InjectModel(ShoppingCart) private shoppingCartModel: typeof ShoppingCart,
		private readonly userService: UsersService,
		private readonly boilerPartsService: BoilerPartsService,
	) { }

	async findAll(userId: number | string): Promise<ShoppingCart[]> {
		return this.shoppingCartModel.findAll({ where: { userId } });
	}

	async add(addToCardDto: AddToCartDto): Promise<ShoppingCart> {
		const cart = new ShoppingCart();
		const user = await this.userService.findOne({
			where: { username: addToCardDto.username },
		});
		const part = await this.boilerPartsService.findOne(addToCardDto.partId);

		cart.userId = user.id;
		cart.partId = part.id;
		cart.boiler_manufacturer = part.boiler_manufacturer;
		cart.parts_manufacturer = part.parts_manufacturer;
		cart.price = part.price;
		cart.in_stock = part.in_stock;
		cart.image = JSON.parse(part.images)[0]; //Преобразуем нашу строку в объект в нашем случае это будет массив и получим 1 элемент массива.
		cart.name = part.name;
		cart.price = part.price;
		cart.total_price = part.price;

		return cart.save();
	}

	async updateCount(
		count: number,
		partId: number | string,
		userId: number | string,
	): Promise<{ count: number }> {
		await this.shoppingCartModel.update(
			{ count },
			{ where: { partId, userId } },
		);

		const cart = await this.shoppingCartModel.findOne({
			where: { partId, userId },
		});
		return { count: cart.count };
	}

	async updateTotalPrice(
		total_price: number,
		partId: number | string,
		userId: number | string,
	): Promise<{ total_price: number }> {
		await this.shoppingCartModel.update(
			{ total_price },
			{ where: { partId, userId } },
		);

		const cart = await this.shoppingCartModel.findOne({
			where: { partId, userId },
		});
		return { total_price: cart.total_price };
	}

	async remove(
		partId: number | string,
		userId: number | string,
	): Promise<void> {
		const cart = await this.shoppingCartModel.findOne({
			where: { partId, userId },
		});
		await cart.destroy();
	}

	async removeAll(userId: number | string): Promise<void> {
		await this.shoppingCartModel.destroy({ where: { userId } });
	}
}
