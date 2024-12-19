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
import { AuthModule } from 'src/auth/auth.module';

const mockedUser = {
	username: 'PavelTest',
	email: 'pavelTest@mail.ru',
	password: 'pavelTest123',
};

describe('Auth Controller', () => {
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

	it('should login user', async () => {
		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		expect(response.body.user.username).toBe(mockedUser.username); //Проверяем совпадаем ли созданное имя пользователя с тем что отправили на сервер
		expect(response.body.user.email).toBe(mockedUser.email); ////Проверяем совпадаем ли созданный email пользователя с тем что отправили на сервер
		expect(response.body.msg).toBe('Logged in'); //Проверим приходит ли нам сообщение о том что пользователь авторизовался
	}); //Напишем сам тест

	it('should login-check', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		//Отправим запрос на сервер
		const loginCheck = await request(app.getHttpServer())
			.get('/users/login-check')
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(loginCheck.body.username).toBe(mockedUser.username); //Проверяем совпадаем ли созданное имя пользователя с тем что отправили на сервер
		expect(loginCheck.body.email).toBe(mockedUser.email); ////Проверяем совпадаем ли созданный email пользователя с тем что отправили на сервер
	}); //Напишем сам тест

	it('should logout', async () => {
		//Отправим запрос на сервер
		const response = await request(app.getHttpServer()).get('/users/logout');

		expect(response.body.msg).toBe('session has ended'); //Проверяем приходит ли нам сообщение о том что сессия завершена
	}); //Напишем сам тест
});
