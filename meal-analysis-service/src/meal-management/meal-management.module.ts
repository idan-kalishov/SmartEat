import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MealManagementController } from './controllers/meal-management.controller';
import { MealManagementService } from './services/meal-management.service';
import { ImageUploadService } from './services/image-upload.service';
import { Meal, MealSchema } from './schemas/meal.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
  ],
  controllers: [MealManagementController],
  providers: [MealManagementService, ImageUploadService],
  exports: [MealManagementService],
})
export class MealManagementModule {} 