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

  async saveExercise(exerciseData: GrpcExercise): Promise<string> {
    const meal = new this.exerciseModel({
      userId: exerciseData.userId,
      name: exerciseData.name,
      calories: exerciseData.calories,
      minutes: exerciseData.minutes,
      createdAt: new Date(exerciseData.createdAt),
    });
    const savedMeal = await meal.save();
    return savedMeal.id;
  }

  async deleteExercise(userId: string, exerciseId: string): Promise<boolean> {
    const exercise = await this.exerciseModel.findOne({
      _id: exerciseId,
      userId,
    });
    if (!exercise) {
      return false;
    }

    const result = await this.exerciseModel.deleteOne({
      _id: exerciseId,
      userId,
    });

    return result.deletedCount > 0;
  }
}
