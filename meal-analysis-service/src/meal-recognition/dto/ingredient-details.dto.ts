import { IsArray, IsString } from 'class-validator';

export class IngredientDetailsDto {
  @IsArray()
  @IsString({ each: true })
  names: string[];
}
