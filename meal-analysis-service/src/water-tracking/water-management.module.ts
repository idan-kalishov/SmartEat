import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WaterIntake, WaterIntakeSchema } from './schema/water.schema';
import { WaterTrackingController } from './controller/water-tracking.controller';
import { WaterTrackingService } from './services/water-tracking.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WaterIntake.name, schema: WaterIntakeSchema },
    ]),
  ],
  controllers: [WaterTrackingController],
  providers: [WaterTrackingService],
  exports: [WaterTrackingService],
})
export class WaterManagementModule {}
