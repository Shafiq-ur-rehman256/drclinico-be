import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const server = express();
async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
    { cors: true }
  );
  app.enableCors({origin: '*'})
  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes(new ValidationPipe())
  app.useStaticAssets(join(__dirname, '..' ,'qr-codes'));
  await app.listen(process.env.APP_HTTP_PORT,()=>{
    console.log(`app is running on ${process.env.APP_HTTP_PORT}`);
  });
}
bootstrap();
