import { NestFactory } from '@nestjs/core';

import { Module } from '@nestjs/common';
import { Field, GraphQLModule,  ObjectType, Query, Resolver, Float } from '@nestjs/graphql';
import { Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class Service implements OnModuleDestroy, OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    console.log('AppService -> on application shutdown');
  }

  async onModuleDestroy() {
    console.log('AppService -> on module destroy');
  }
}

@ObjectType()
export class Model {
  @Field(type => Float)
  id: number
}

@Resolver(of => Model)
export class ModelResolver {
  @Query(returns => Model)
  async model() {
    const m = new Model();
    m.id = new Date().valueOf();
    return m;
  }
}

@Module({
  imports: [
    // NOTE: when this is included Service.onApplicationShutdown is never called
    GraphQLModule.forRoot({
      autoSchemaFile: true
    })
  ],
  providers: [Service, ModelResolver],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
