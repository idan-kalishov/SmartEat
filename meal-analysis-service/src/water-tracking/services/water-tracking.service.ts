import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WaterIntake } from '../schema/water.schema';
// import { SaveWaterIntakeRequest } from '../../generated/water-tracking';

@Injectable()
export class WaterTrackingService {
  constructor(
    @InjectModel(WaterIntake.name)
    private readonly waterModel: Model<WaterIntake>,
  ) {}

  async saveWater(data: any): Promise<string> {
    const existing = await this.waterModel.findOne({
      userId: data.userId,
      date: data.date ? new Date(data.date) : new Date(),
    });

    if (existing) {
      existing.amountLiters = data.amountLiters;
      const updated = await existing.save();
      return updated.id;
    }

    const newEntry = new this.waterModel({
      userId: data.userId,
      amountLiters: data.amountLiters,
      date: data.date ? new Date(data.date) : new Date(),
    });

    const saved = await newEntry.save();
    return saved.id;
  }

  async getWaterByDate(
    userId: string,
    date: string,
  ): Promise<WaterIntake | null> {
    const parsedDate = new Date(date);
    return this.waterModel.findOne({
      userId,
      date: {
        $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(parsedDate.setHours(23, 59, 59, 999)),
      },
    });
  }
}
