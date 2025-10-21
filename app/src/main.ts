import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envVars, envVarValue } from './config/constants/env-constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { defaultConstants } from './config/constants/default-constants';
import helmet from 'helmet';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
      origin: [
        defaultConstants.domains.ADMIN,
        ...defaultConstants.domains.CLIENT,
      ],
      credentials: true,
    });
    app.use(helmet());
    app.useStaticAssets(join(__dirname, '..', 'public'));

    app.use(cookieParser());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );
    const config = new DocumentBuilder()
      .setTitle('Burger House API')
      .setDescription('Describe how the endpoints work')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addGlobalResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server Error.',
      })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(envVarValue[envVars.APP_PORT], () =>
      console.log(`server run on port: ${envVarValue[envVars.APP_PORT]}`),
    );
    return;
  } catch (error) {
    console.log(error);
  }
}

bootstrap().catch((err) => console.log(err));
