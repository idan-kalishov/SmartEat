import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WaterIntake extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amountLiters: number;

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const WaterIntakeSchema = SchemaFactory.createForClass(WaterIntake);
