import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
	imports: [UsersModule,
		PassportModule.register({ session: true })], //Указываем что авторизация будет по сессиям
	providers: [AuthService, LocalStrategy, SessionSerializer]
})
export class AuthModule { }
