import { Module } from '@nestjs/common';
import { MealAnalysisController } from './controllers/meal-analysis.controller';
import { MealAnalysisService } from './services/meal-analysis.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MealAnalysisController],
  providers: [MealAnalysisService],
})
export class MealAnalysisModule {}
