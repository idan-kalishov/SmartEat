import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealManagementController } from './controllers/meal-management.controller';
import { MealManagementService } from './services/meal-management.service';
import { Meal, MealSchema } from './schemas/meal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
  ],
  controllers: [MealManagementController],
  providers: [MealManagementService],
  exports: [MealManagementService],
})
export class MealManagementModule {} 