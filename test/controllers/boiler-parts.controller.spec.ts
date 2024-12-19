import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfing } from 'src/config/configuration';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';
import { AuthModule } from 'src/auth/auth.module';

const mockedUser = {
	username: 'PavelTest',
	email: 'pavelTest@mail.ru',
	password: 'pavelTest123',
};

describe('Boiler-Parts Controller', () => {
	let app: INestApplication;

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
				AuthModule,
				BoilerPartsModule,
			],
		}).compile();

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

	afterEach(async () => {
		//Запускается после тестов
		await User.destroy({ where: { username: mockedUser.username } });
	});

	it('should get one parts', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.get('/boiler-parts/find/1')
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body).toEqual(
			expect.objectContaining({
				id: 1,
				boiler_manufacturer: expect.any(String),
				price: expect.any(Number),
				parts_manufacturer: expect.any(String),
				vender_code: expect.any(String),
				name: expect.any(String),
				description: expect.any(String),
				images: expect.any(String),
				in_stock: expect.any(Number),
				bestsellers: expect.any(Boolean),
				new: expect.any(Boolean),
				popularity: expect.any(Number),
				compatibility: expect.any(String),
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			}),
		); //Проверяем совпадает ли то что пришло с сервера с нашей моделью, явно указываем id записи
	}); //Напишем сам тест

	it('should get bestsellers', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.get('/boiler-parts/bestsellers')
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body.rows).toEqual(
			expect.arrayContaining([
				{
					id: expect.any(Number),
					boiler_manufacturer: expect.any(String),
					price: expect.any(Number),
					parts_manufacturer: expect.any(String),
					vender_code: expect.any(String),
					name: expect.any(String),
					description: expect.any(String),
					images: expect.any(String),
					in_stock: expect.any(Number),
					bestsellers: true,
					new: expect.any(Boolean),
					popularity: expect.any(Number),
					compatibility: expect.any(String),
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
				},
			]),
		); //Проверяем совпадает ли то что пришло с сервера с массивом данных определённого типа
	}); //Напишем сам тест

	it('should get new', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.get('/boiler-parts/new')
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body.rows).toEqual(
			expect.arrayContaining([
				{
					id: expect.any(Number),
					boiler_manufacturer: expect.any(String),
					price: expect.any(Number),
					parts_manufacturer: expect.any(String),
					vender_code: expect.any(String),
					name: expect.any(String),
					description: expect.any(String),
					images: expect.any(String),
					in_stock: expect.any(Number),
					bestsellers: expect.any(Boolean),
					new: true,
					popularity: expect.any(Number),
					compatibility: expect.any(String),
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
				},
			]),
		); //Проверяем совпадает ли то что пришло с сервера с массивом данных определённого типа
	}); //Напишем сам тест

	it('should search by string', async () => {
		const body = { search: 'cur' };
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.post('/boiler-parts/search')
			.send(body)
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body.rows.length).toBeLessThanOrEqual(20); //Проверим что массив который приходит с сервера не больше 20 элементов, т.к у нас стоит ограничение по количеству
		response.body.rows.forEach((element) => {
			expect(element.name.toLowerCase()).toContain(body.search); //Проверим содержат ли наши объекты в поле name строку для поиска, toLowerCase приводим к одному регистру и toContain проверяем есть строка поиска в имени элемента
		});
		expect(response.body.rows).toEqual(
			expect.arrayContaining([
				{
					id: expect.any(Number),
					boiler_manufacturer: expect.any(String),
					price: expect.any(Number),
					parts_manufacturer: expect.any(String),
					vender_code: expect.any(String),
					name: expect.any(String),
					description: expect.any(String),
					images: expect.any(String),
					in_stock: expect.any(Number),
					bestsellers: expect.any(Boolean),
					new: expect.any(Boolean),
					popularity: expect.any(Number),
					compatibility: expect.any(String),
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
				},
			]),
		); //Проверяем совпадает ли то что пришло с сервера с массивом данных определённого типа
	}); //Напишем сам тест

	it('should get by name', async () => {
		const body = { name: 'Canonicus cur.' };
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.post('/boiler-parts/name')
			.send(body)
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body).toEqual(
			expect.objectContaining({
				id: expect.any(Number),
				boiler_manufacturer: expect.any(String),
				price: expect.any(Number),
				parts_manufacturer: expect.any(String),
				vender_code: expect.any(String),
				name: body.name,
				description: expect.any(String),
				images: expect.any(String),
				in_stock: expect.any(Number),
				bestsellers: expect.any(Boolean),
				new: expect.any(Boolean),
				popularity: expect.any(Number),
				compatibility: expect.any(String),
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			}),
		); //Проверяем совпадает ли то что пришло с сервера с нашей моделью, также поле name должно быть таким что мы отправили в body т.к ищем запись с таким же именем
	}); //Напишем сам тест
});
