/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({
    origin:"*",
    Credential:true

    
  })
app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
  const config = new DocumentBuilder()
  .setDescription('API documentation for Example project')
  .setTitle('project management api')
  .addServer("http://localhost:5000")
  .addTag('example')
  .setVersion("1.0")
  .addBearerAuth()
  .build()
  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api', app, document, {
customSiteTitle: 'Example API Docs',
swaggerOptions: { docExpansion: 'none' }
});
  await app.listen(5000);
}
bootstrap();
