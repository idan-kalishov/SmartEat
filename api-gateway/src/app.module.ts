import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { AuthGatewayModule } from './authGateway/auth.gateway.module';

@Module({
  imports: [RecommendationsModule, AuthGatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
