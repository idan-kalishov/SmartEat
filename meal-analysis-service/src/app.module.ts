import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FoodRecognitionModule } from './meal-recognition/modules/food-recognition.module';

@Module({
  imports: [FoodRecognitionModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
