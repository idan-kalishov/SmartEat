import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FoodRecognitionModule } from './meal-recognition/modules/food-recognition.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [FoodRecognitionModule, 
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/smarteat'),
    ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
