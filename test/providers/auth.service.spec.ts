import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfing } from 'src/config/configuration';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

const mockedUser = {
	username: 'PavelTest',
	email: 'pavelTest@mail.ru',
	password: 'pavelTest123',
};

describe('Auth Service', () => {
	let app: INestApplication;
	let authService: AuthService;

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

		authService = testModule.get<AuthService>(AuthService);
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

	afterEach(async () => {
		//Запускается после тестов
		await User.destroy({ where: { username: mockedUser.username } });
	});

	it('should login user', async () => {
		const user = await authService.validateUser(
			mockedUser.username,
			mockedUser.password,
		);

		expect(user.username).toBe(mockedUser.username); //Проверяем совпадаем ли созданное имя пользователя с тем что отправили на сервер
		expect(user.email).toBe(mockedUser.email); ////Проверяем совпадаем ли созданный email пользователя с тем что отправили на сервер
	}); //Напишем сам тест
});
