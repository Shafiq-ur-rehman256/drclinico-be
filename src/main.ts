import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_HTTP_PORT,()=>{
    console.log(`app is running on ${process.env.APP_HTTP_PORT}`);
  });
}
bootstrap();
