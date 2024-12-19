import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfing } from 'src/config/configuration';
import { User } from 'src/users/users.model';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';
import { AuthModule } from 'src/auth/auth.module';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service';
import { UsersService } from 'src/users/users.service';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';

const mockedUser = {
	username: 'PavelTest',
	email: 'pavelTest@mail.ru',
	password: 'pavelTest123',
};

describe('Shoping-Cart Controller', () => {
	let app: INestApplication;
	let boilerPartsService: BoilerPartsService;
	let userService: UsersService;

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
		app = testModule.createNestApplication();
		app.use(
			session({
				secret: 'keywordmyshop',
				resave: false,
				saveUninitialized: false,
			}),
		);
		app.use(passport.initialize());
		app.use(passport.session());
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

	it('should get all cart items', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.get('/shopping-cart/' + user.id)
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body).toEqual(
			expect.arrayContaining([
				{
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
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
				},
			]),
		);
	}); //Напишем сам тест

	it('should add cart item', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		//Отправим запрос на сервер
		await request(app.getHttpServer())
			.post('/shopping-cart/add')
			.send({ username: mockedUser.username, partId: 5 }) //Укажем partId = 5 т.к 1 добляем для теста в самом начале, чтобы не было путаницы
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.get('/shopping-cart/' + user.id)
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body.find((item) => item.partId === 5)).toEqual(
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
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			}),
		);
	}); //Напишем сам тест

	it('should get updated count of cart item', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.patch('/shopping-cart/count/1') //Обновляем количество у первого элемента потому что добавляем partId = 1 в начале теста
			.send({ count: 2 })
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body).toEqual({ count: 2 });
	}); //Напишем сам тест

	it('should get updated total-price of cart item', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		const part = await boilerPartsService.findOne(1);

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.patch('/shopping-cart/total-price/1') //Обновляем количество у первого элемента потому что добавляем partId = 1 в начале теста
			.send({ total_price: part.price * 2 })
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body).toEqual({ total_price: part.price * 2 });
	}); //Напишем сам тест

	it('should delete cart item', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		//Отправим запрос на сервер
		await request(app.getHttpServer())
			.delete('/shopping-cart/one/1')
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.get('/shopping-cart/' + user.id)
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body.find((item) => item.partId === 1)).toBeUndefined(); //Проверяем что сервер не вернет элемента у которого partId = 1
	}); //Напишем сам тест

	it('should delete all cart items', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		const user = await userService.findOne({
			where: { username: mockedUser.username },
		});

		//Отправим запрос на сервер
		await request(app.getHttpServer())
			.delete('/shopping-cart/all/' + user.id)
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.get('/shopping-cart/' + user.id)
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body).toStrictEqual([]); //Проверяем что сервера нам приходит пустой массив
	}); //Напишем сам тест
});
