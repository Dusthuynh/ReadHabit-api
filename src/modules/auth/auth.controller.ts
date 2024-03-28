import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	UnauthorizedException,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SuccessResponse } from 'src/shared/response/success-response';
import { RegisterDto } from './dto/register.dto';
import { Public } from './utils';
import { LoginDto } from './dto/login.dto';
import { TokenResponse } from './dto/token-payload.dto';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { userData } from 'src/seeder/data/user.data';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('login')
	@ApiBody({
		type: LoginDto,
		examples: {
			ADMIN_1: {
				summary: userData[0].username,
				value: {
					email: userData[0].email,
					password: '123123123',
				} as LoginDto,
			},
			ADMIN_2: {
				summary: userData[1].username,
				value: {
					email: userData[1].email,
					password: '123123123',
				} as LoginDto,
			},
			USER_1: {
				summary: userData[2].username,
				value: {
					email: userData[2].email,
					password: '123123123',
				} as LoginDto,
			},
			USER_2: {
				summary: userData[3].username,
				value: {
					email: userData[3].email,
					password: '123123123',
				} as LoginDto,
			},
			USER_3: {
				summary: userData[4].username,
				value: {
					email: userData[4].email,
					password: '123123123',
				} as LoginDto,
			},
			USER_4: {
				summary: userData[5].username,
				value: {
					email: userData[5].email,
					password: '123123123',
				} as LoginDto,
			},
		},
	})
	@ApiCreatedResponse({ type: TokenResponse, status: 201 })
	@ApiUnauthorizedResponse({
		status: 401,
		description: 'UnAuthorization',
	})
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Public()
	@Post('register')
	@ApiCreatedResponse({
		schema: {
			example: {
				statusCode: 200,
				message: 'Register success!',
			} as SuccessResponse<any>,
		},
		status: 201,
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Public()
	@Post('refresh-token')
	@ApiOperation({ description: 'Refresh new token' })
	@ApiCreatedResponse({ type: TokenResponse, status: 201 })
	@ApiUnauthorizedResponse({
		type: UnauthorizedException,
		status: 400,
		description: 'Token invalid',
	})
	refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refreshToken(refreshTokenDto);
	}

	@Get('me')
	@ApiBearerAuth()
	@ApiOperation({ description: 'Get loggedIn user info ' })
	@ApiResponse({ type: User, status: 200 })
	@ApiUnauthorizedResponse({
		type: UnauthorizedException,
		status: 400,
		description: 'Token invalid',
	})
	async getProfile(@CurrentUser('uid') userId: number) {
		return this.authService.getProfile(userId);
	}
}
