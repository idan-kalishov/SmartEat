import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IngredientDetails } from '../models/ingredient-details.interface';

export type MealDocument = Meal & Document & { createdAt?: Date };

@Schema({ timestamps: true })
export class Meal extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [Object] })
  ingredients: IngredientDetails[];

  @Prop()
  imageData?: Buffer;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
