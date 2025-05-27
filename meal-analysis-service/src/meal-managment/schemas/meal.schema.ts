import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IngredientDetails } from '../models/ingredient-details.interface';

@Schema()
export class Meal extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [Object], required: true })
  ingredients: IngredientDetails[];

  @Prop({ type: Buffer })
  imageData?: Buffer;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
export type MealDocument = Meal & Document;
