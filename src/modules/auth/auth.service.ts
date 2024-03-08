import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { Password } from 'src/utils/password';
import { LoginDto } from './dto/login.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UsersService,
		private readonly configService: ConfigService,
	) {}

	async login(loginDto: LoginDto) {
		const user = await this.userService.findOneWithoutThrowError({
			email: loginDto.email,
		});
		if (!user) throw new UnauthorizedException();

		const isMatchPassword = await Password.comparePassword(
			user.password,
			loginDto.password,
		);
		if (!isMatchPassword) {
			throw new UnauthorizedException();
		}

		const payload: TokenPayloadDto = {
			iss: this.configService.get('APP_NAME')!,
			sub: user.id,
			role: user.role,
		};
		return {
			access_token: this.jwtService.sign(payload),
			refresh_token: this.jwtService.sign(payload, {
				secret: this.configService.get('JWT_REFRESH_SECRET'),
				expiresIn: this.configService.get('JWT_REFRESH_EXPIRED'),
			}),
		};
	}

	async register(input: RegisterDto) {
		const user = await this.userService.findOneWithoutThrowError({
			email: input.email,
		});
		if (user) {
			throw new BadRequestException('User has existed!');
		}

		input.password = await Password.hashPassword(input.password);
		const newUser = await this.userService.createOne(input);

		if (newUser) {
			return 'Registration Successful';
		}
		throw new BadRequestException('Create user failed!');
	}

	async refreshToken({ token }: RefreshTokenDto): Promise<any> {
		const payload: TokenPayloadDto = this.jwtService.verify(token, {
			secret: this.configService.get('JWT_REFRESH_SECRET'),
		});
		if (payload) {
			const { iss, sub, role } = payload;
			const signPayload: TokenPayloadDto = {
				iss,
				sub,
				role,
			};
			return {
				access_token: this.jwtService.sign(signPayload),
				refresh_token: this.jwtService.sign(signPayload, {
					secret: this.configService.get('JWT_REFRESH_SECRET'),
					expiresIn: this.configService.get('JWT_REFRESH_EXPIRED'),
				}),
			};
		}
		throw new UnauthorizedException();
	}

	async getProfile(userId: number) {
		return await this.userService.findUserById(userId);
	}
}
