import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise as MongoExercise } from '../schemas/exercise.schema';
import { Exercise as GrpcExercise } from 'src/generated/exercise';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(MongoExercise.name)
    private readonly exerciseModel: Model<MongoExercise>,
  ) {}

  async getExercisesByDate(
    userId: string,
    date: string,
  ): Promise<MongoExercise[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return this.exerciseModel
      .find({
        userId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();
  }

  async saveExercise(mealData: GrpcExercise): Promise<string> {
    const meal = new this.exerciseModel({
      userId: mealData.userId,
      name: mealData.name,
      calories: mealData.calories,
      minutes: mealData.minutes,
      createdAt: new Date(mealData.createdAt),
    });
    const savedMeal = await meal.save();
    return savedMeal.id;
  }
}
