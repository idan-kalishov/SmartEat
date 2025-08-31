import { Module } from '@nestjs/common';
import { AuthGatewayController } from './auth.gateway.controller';
import { AuthGatewayService } from './auth.gateway.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AuthGatewayController],
  providers: [AuthGatewayService],
  exports: [AuthGatewayService],
})
export class AuthGatewayModule {}
