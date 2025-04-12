// src/nutrition/dto/user-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  ACTIVE = 'active',
  VERY_ACTIVE = 'very_active',
}

export enum WeightGoal {
  LOSE = 'lose',
  MAINTAIN = 'maintain',
  GAIN = 'gain',
}

export class UserProfileDto {
  @ApiProperty({ example: 30 })
  age: number;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ example: 70 })
  weight: number; // kg

  @ApiProperty({ example: 175 })
  height: number; // cm

  @ApiProperty({ enum: ActivityLevel })
  activityLevel: ActivityLevel;

  @ApiProperty({ enum: WeightGoal })
  weightGoal: WeightGoal;

  @ApiProperty({ required: false })
  goalIntensity?: 'mild' | 'moderate' | 'aggressive';
}
