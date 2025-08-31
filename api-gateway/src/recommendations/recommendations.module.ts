import { Module } from '@nestjs/common';
import { RecommendationsClient } from 'src/grpc/clients/recommendations.client';
import { NutritionController } from './controller/recommendations.controller';
import { AuthGatewayModule } from 'src/authGateway/auth.gateway.module';

@Module({
  imports: [AuthGatewayModule],
  providers: [RecommendationsClient],
  controllers: [NutritionController],
})
export class RecommendationsModule {}
