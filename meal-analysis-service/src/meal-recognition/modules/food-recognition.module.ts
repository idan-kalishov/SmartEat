import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { FoodRecognitionService } from '../services/food-recognition.service';
import { FoodRecognitionController } from '../controllers/meal-recognition.controller';

@Module({
  imports: [
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
  controllers: [FoodRecognitionController],
  providers: [FoodRecognitionService],
  exports: [FoodRecognitionService],
})
export class FoodRecognitionModule {}
