import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MealAnalysisModule } from './meal-analysis/meal-analysis.module';
import { MealManagementModule } from './meal-management/meal-management.module';
import { WaterManagementModule } from './water-tracking/water-management.module';

@Module({
  imports: [
    MealAnalysisModule,
    MealManagementModule,
    WaterManagementModule,
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/smarteat',
    ),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
