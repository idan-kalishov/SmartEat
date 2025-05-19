import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealController } from './controllers/meal.controller';
import { MealService } from './services/meal.service';
import { Meal, MealSchema } from './schemas/meal.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }])],
  controllers: [MealController],
  providers: [MealService],
})
export class MealManagementModule {}
