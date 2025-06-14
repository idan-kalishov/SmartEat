import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Ingredient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ type: Object })
  nutrition?: {
    per100g: {
      [key: string]: {
        value?: number;
        unit: string;
      };
    };
  };
}

@Schema({ timestamps: true })
export class Meal extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [Ingredient], required: true })
  ingredients: Ingredient[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  imageUrl?: string;
}

export const MealSchema = SchemaFactory.createForClass(Meal); 