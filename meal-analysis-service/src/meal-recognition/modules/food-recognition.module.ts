import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { FoodRecognitionService } from '../services/food-recognition.service';
import { FoodRecognitionController } from '../controllers/meal-recognition.controller';
import { Meal, MealSchema } from '../schemas/meal.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MealService } from '../services/meal.service';
import { MealController } from '../controllers/meal.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),    
    HttpModule,
    ClientsModule.register([
      {
        name: 'FOOD_RECOGNITION_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'foodrecognition',
          protoPath: join(__dirname, '../../proto/food-recognition.proto'),
          url: `0.0.0.0:${process.env.FOOD_RECOGNITION_GRPC_PORT || 50052}`,
        },
      },
    ]),
  ],
  controllers: [FoodRecognitionController, MealController],
  providers: [FoodRecognitionService, MealService],
  exports: [FoodRecognitionService, MealService],
})
export class FoodRecognitionModule {}
