import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Exercise extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  calories: string;

  @Prop({ required: true })
  minutes: number;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
