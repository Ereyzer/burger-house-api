import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envVars, envVarValue } from './config/constants/env-constants';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(envVarValue[envVars.APP_PORT], () =>
      console.log(`server run on port: ${envVarValue[envVars.APP_PORT]}`),
    );
    return;
  } catch (error) {
    console.log(error);
  }
}

bootstrap().catch((err) => console.log(err));
