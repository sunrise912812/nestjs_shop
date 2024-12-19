import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfing } from 'src/config/configuration';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service';

describe('BoilerParts Service', () => {
	let app: INestApplication;
	let boilerPartsService: BoilerPartsService;

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
				BoilerPartsModule,
			],
		}).compile();

		boilerPartsService = testModule.get<BoilerPartsService>(BoilerPartsService);
		app = testModule.createNestApplication();
		app.init(); //Инийиализируем тестовый модуль
	});

	it('should find by id', async () => {
		const part = await boilerPartsService.findOne(1);

		expect(part.dataValues).toEqual(
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
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		); //Проверяем совпадает ли то что пришло с нашего сервиса с нашей моделью, также поле name должно быть таким что мы отправили в body т.к ищем запись с таким же именем
	}); //Напишем сам тест

	it('should find by name', async () => {
		const part = await boilerPartsService.findOneByName('Canonicus cur.');

		expect(part.dataValues).toEqual(
			expect.objectContaining({
				id: expect.any(Number),
				boiler_manufacturer: expect.any(String),
				price: expect.any(Number),
				parts_manufacturer: expect.any(String),
				vender_code: expect.any(String),
				name: 'Canonicus cur.',
				description: expect.any(String),
				images: expect.any(String),
				in_stock: expect.any(Number),
				bestsellers: expect.any(Boolean),
				new: expect.any(Boolean),
				popularity: expect.any(Number),
				compatibility: expect.any(String),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		); //Проверяем совпадает ли то что пришло с нашего сервиса с нашей моделью, также поле name должно быть таким что мы отправили в body т.к ищем запись с таким же именем
	}); //Напишем сам тест

	it('should find search by string', async () => {
		const parts = await boilerPartsService.searchByString('cur');

		expect(parts.rows.length).toBeLessThanOrEqual(20);
		parts.rows.forEach((element) => {
			expect(element.name.toLowerCase()).toContain('cur'); //Проверим содержат ли наши объекты в поле name строку для поиска, toLowerCase приводим к одному регистру и toContain проверяем есть строка поиска в имени элемента
			expect(element.dataValues).toEqual(
				expect.objectContaining({
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
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				}),
			); //Проверяем совпадает ли то что пришло с нашего сервиса с нашей моделью
		});
	}); //Напишем сам тест

	it('should find bestsellers', async () => {
		const parts = await boilerPartsService.bestsellers();

		parts.rows.forEach((element) => {
			expect(element.dataValues).toEqual(
				expect.objectContaining({
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
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				}),
			); //Проверяем совпадает ли то что пришло с нашего сервиса с нашей моделью
		});
	}); //Напишем сам тест

	it('should find new', async () => {
		const parts = await boilerPartsService.new();

		parts.rows.forEach((element) => {
			expect(element.dataValues).toEqual(
				expect.objectContaining({
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
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				}),
			); //Проверяем совпадает ли то что пришло с нашего сервиса с нашей моделью
		});
	}); //Напишем сам тест
});
