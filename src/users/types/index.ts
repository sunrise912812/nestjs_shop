import { ApiProperty } from '@nestjs/swagger';

//Опишем схемы для описания что нужно получать с frontend

export class LoginUserRequest {
	@ApiProperty({ example: 'Pavel' })
	username: string;

	@ApiProperty({ example: 'Pavel123' })
	password: string;
}

export class LoginUserResponse {
	@ApiProperty({
		example: {
			user: {
				userId: 1,
				username: 'Pavel',
				email: 'pavel@mai.ru'
			}
		}
	})
	user: {
		userId: number,
		username: string,
		email: string
	}

	@ApiProperty({ example: 'Logged in' })
	msg: string;
}

export class LogOutUserResponse {
	@ApiProperty({ example: 'session has ended' })
	msg: string;
}

export class LoginCheckResponse {
	@ApiProperty({ example: 1 })
	userId: number;

	@ApiProperty({ example: 'Pavel' })
	username: string;

	@ApiProperty({ example: 'pavel@mail.ru' })
	email: string;
}

export class SignupResponse {
	@ApiProperty({ example: 1 })
	userId: number;

	@ApiProperty({ example: 'Pavel' })
	username: string;

	@ApiProperty({ example: '$3b$10$zdZl7n91iphB4YlhhTHZVuX4evo7/AmVv9vYIYSc8hwrj3DCsaWj.' })
	password: string;

	@ApiProperty({ example: 'pavel@mail.ru' })
	email: string;

	@ApiProperty({ example: '2024-01-18T04:42:51.168Z' })
	createdAt: string;

	@ApiProperty({ example: '2024-01-18T04:42:51.168Z' })
	updatedAt: string;

}