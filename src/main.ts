import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
// import { HttpExceptionFilter } from 'src/filters/http-exception.filter';


async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors:true});
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
    // whitelist:true
  })
  )
  // app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api/v1');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
   app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public',
});
const configService = app.get(ConfigService);
  const Swagconfig = new DocumentBuilder()
    .setTitle('Reception App Backend EndPoint')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();
  const document = SwaggerModule.createDocument(app, Swagconfig);
  SwaggerModule.setup('api', app, document);
  // app.useLogger(app.get(Logger));
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);


}
bootstrap();
