import { NestFactory } from '@nestjs/core';
import { SpokenLanguagesModule } from './spoken-languages.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(SpokenLanguagesModule);
  const configService = app.get(ConfigService)
  const USER = configService.get('RABBITMQ_DEFAULT_USER');
  const PASSWORD =  configService.get('RABBITMQ_DEFAULT_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const QUEUE = configService.get('RABBITMQ_SPOKENLANGUAGE_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      noAck:false,
      queue: QUEUE,
      queueOptions: {
        durable: true
      }
    }
  })
  await app.startAllMicroservices();
}
bootstrap();
