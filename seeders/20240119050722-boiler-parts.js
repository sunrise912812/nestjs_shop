const { faker } = require('@faker-js/faker');
('use strict');

//Создадим массив с производителями котлов
const boilerManufacturers = [
	'Electrolux',
	'Ariston',
	'Zanussi',
	'Eldom',
	'Atlantic',
	'Gorenje',
	'Klima Hitze',
	'Roda',
];

//Создадим массив с производителями запчестей
const partsManufacturers = [
	'Azure',
	'Gloves',
	'Cambridgeshire',
	'Salmon',
	'Montana',
	'Sensor',
	'Lesly',
	'Radian',
	'Gasoline',
	'Croatia',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert(
			'BoilerParts',
			[...Array(100)].map(() => ({
				boiler_manufacturer:
					boilerManufacturers[
					Math.floor(Math.random() * boilerManufacturers.length)
					], // В поле будет записыветься случайное значение из нашего массива
				price: faker.random.numeric(4), // Вернем случайное 4-значное число
				parts_manufacturer:
					partsManufacturers[
					Math.floor(Math.random() * partsManufacturers.length)
					],
				vender_code: faker.internet.password(), // В качестве кода будет случайный пароль
				name: faker.lorem.sentence(2), //Рандомно вернем предложение из 2 слов
				description: faker.lorem.sentence(10),
				images: JSON.stringify(
					[...Array(7)].map(
						() =>
							`${faker.image.technics()}?random=${faker.random.numeric(30)}`,
					),
				), // Будем возвращать массив из 7 картинок который сразе преобразуем в JSON
				in_stock: faker.random.numeric(1),
				bestsellers: faker.datatype.boolean(),
				new: faker.datatype.boolean(),
				popularity: faker.random.numeric(3),
				compatibility: faker.lorem.sentence(7),
				createdAt: new Date(),
				updatedAt: new Date(),
			})),
		); //Создаем массив из 100 записей с данными бойлеров
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('BoilerParts', null, {});
	},
};
