import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appConfig } from './app.config';

async function bootstrap() {
	console.log(process.env);
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle(appConfig.name)
		.setDescription('APIs Document')
		.setVersion(appConfig.version)
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('docs', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	await app.listen(3000);
}
bootstrap();
