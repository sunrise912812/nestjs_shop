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
import { PaymentModule } from 'src/payment/payment.module';

const mockedUser = {
	username: 'PavelTest',
	email: 'pavelTest@mail.ru',
	password: 'pavelTest123',
};

const mockedPay = {
	status: 'pending',
	amount: {
		value: '100.00',
		currency: 'RUB',
	},
};

describe('Payment Controller', () => {
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
				PaymentModule,
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
		await User.destroy({ where: { username: mockedUser.username } });
	});

	it('should make payment', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.username, password: mockedUser.password });

		//Отправим запрос на сервер
		const response = await request(app.getHttpServer())
			.post('/payment')
			.send({ amount: '100' })
			.set('Cookie', login.headers['set-cookie']); //Отправим полученные куки для проверки авторизован пользователь или нет

		expect(response.body.status).toEqual(mockedPay.status); //Проверяем что то что приходит с сервера совпадает с нашими тестовыми данными
		expect(response.body.amount).toEqual(mockedPay.amount);
	}); //Напишем сам тест
});
