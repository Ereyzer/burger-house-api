import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envVars, envVarValue } from './config/constants/env-constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('Burger House API')
      .setDescription('Describe how the endpoints work')
      .setVersion('1.0.0')
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
