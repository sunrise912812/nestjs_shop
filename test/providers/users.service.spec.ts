import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfing } from 'src/config/configuration';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

describe('Users Service', () => {
	let app: INestApplication;
	let usersService: UsersService;

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
				UsersModule,
			],
		}).compile();

		usersService = testModule.get<UsersService>(UsersService); //Получим доступ в тестах к UsersService
		app = testModule.createNestApplication();
		app.init(); //Инийиализируем тестовый модуль
	});

	afterEach(async () => {
		//Запускается после тестов
		await User.destroy({ where: { username: 'Test' } });
	});

	it('should create user', async () => {
		const newUser = {
			username: 'Test',
			email: 'test@mail.ru',
			password: 'test123',
		};

		const user = (await usersService.create(newUser)) as User; //Сохраним пользователя и приведем к типу User

		const passwordIsValid = await bcrypt.compare(
			newUser.password,
			user.password,
		);

		expect(user.username).toBe(newUser.username); //Проверяем совпадаем ли созданное имя пользователя с тем что отправили на сервер
		expect(passwordIsValid).toBe(true); //Проверяем валидный ли пароль т.е переменная passwordIsValid = true
		expect(user.email).toBe(newUser.email); ////Проверяем совпадаем ли созданный email пользователя с тем что отправили на сервер
	}); //Напишем сам тест
});
