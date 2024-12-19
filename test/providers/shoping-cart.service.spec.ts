import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfing } from 'src/config/configuration';
import { User } from 'src/users/users.model';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model';
import * as bcrypt from 'bcrypt';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';
import { AuthModule } from 'src/auth/auth.module';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service';
import { UsersService } from 'src/users/users.service';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';
import { ShoppingCartService } from 'src/shopping-cart/shopping-cart.service';

const mockedUser = {
	username: 'PavelTest',
	email: 'pavelTest@mail.ru',
	password: 'pavelTest123',
};

describe('Shoping-Cart Service', () => {
	let app: INestApplication;
	let boilerPartsService: BoilerPartsService;
	let userService: UsersService;
	let shoppingCartService: ShoppingCartService;

	beforeEach(async () => {
		//Будет вызываться до тестирования
		const testModule: TestingModule = await Test.createTestingModule({
			imports: [
				SequelizeModule.forRootAsync({
					imports: [ConfigModule],
					useClass: SequelizeConfigService,
				}),
				ConfigModule.forRoot({
					load: [databaseConfing],
				}),
				ShoppingCartModule,
				AuthModule,
				BoilerPartsModule,
			],
		}).compile();

		boilerPartsService = testModule.get<BoilerPartsService>(BoilerPartsService);
		userService = testModule.get<UsersService>(UsersService);
		shoppingCartService =
			testModule.get<ShoppingCartService>(ShoppingCartService);
		app = testModule.createNestApplication();
		app.init(); //Инийиализируем тестовый модуль
	});

	beforeEach(async () => {
		const user = new User();
		const hashedPassword = await bcrypt.hash(mockedUser.password, 10);
		user.username = mockedUser.username;
		user.password = hashedPassword;
		user.email = mockedUser.email;

		return user.save();
	});

	beforeEach(async () => {
		const cart = new ShoppingCart();
		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});
		const part = await boilerPartsService.findOne(1);

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
	});

	afterEach(async () => {
		//Запускается после тестов
		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});
		await ShoppingCart.destroy({ where: { userId: user.id } });
		await User.destroy({ where: { username: mockedUser.username } });
	});

	it('should return all cart items', async () => {
		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});

		const carts = await shoppingCartService.findAll(user.id);

		carts.forEach((item) =>
			expect(item.dataValues).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					userId: user.id,
					partId: expect.any(Number),
					boiler_manufacturer: expect.any(String),
					price: expect.any(Number),
					parts_manufacturer: expect.any(String),
					name: expect.any(String),
					image: expect.any(String),
					in_stock: expect.any(Number),
					count: expect.any(Number),
					total_price: expect.any(Number),
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				}),
			),
		);
	}); //Напишем сам тест

	it('should add cart items', async () => {
		await shoppingCartService.add({ username: mockedUser.username, partId: 5 }); //Указываем partId =5 потому что с 1 добавляем раньше

		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});

		const carts = await shoppingCartService.findAll(user.id);

		expect(carts.find((item) => item.partId === 5)).toEqual(
			expect.objectContaining({
				id: expect.any(Number),
				userId: user.id,
				partId: 5,
				boiler_manufacturer: expect.any(String),
				price: expect.any(Number),
				parts_manufacturer: expect.any(String),
				name: expect.any(String),
				image: expect.any(String),
				in_stock: expect.any(Number),
				count: expect.any(Number),
				total_price: expect.any(Number),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		); //Проверяем совпадает ли то что пришло с нашего сервиса с нашей моделью
	}); //Напишем сам тест

	it('should return updated count of cart item', async () => {
		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});

		const result = await shoppingCartService.updateCount(2, 1, user.id);

		expect(result).toEqual({ count: 2 });
	}); //Напишем сам тест

	it('should return updated total-price of cart item', async () => {
		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});

		const part = await boilerPartsService.findOne(1);

		const result = await shoppingCartService.updateTotalPrice(
			part.price * 2,
			1,
			user.id,
		);

		expect(result).toEqual({ total_price: part.price * 2 });
	}); //Напишем сам тест

	it('should delete cart item', async () => {
		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});

		await shoppingCartService.remove(1, user.id);

		const carts = await shoppingCartService.findAll(user.id);

		expect(carts.find((item) => item.partId === 1)).toBeUndefined();
	}); //Напишем сам тест

	it('should delete all cart items', async () => {
		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});

		await shoppingCartService.removeAll(user.id);

		const carts = await shoppingCartService.findAll(user.id);

		expect(carts).toStrictEqual([]);
	}); //Напишем сам тест
});
