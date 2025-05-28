import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const mealManagementGrpcOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'mealmgmt',
    protoPath: join(__dirname, '../proto/meal-management.proto'),
    url: process.env.MEAL_MANAGEMENT_SERVICE_URL || 'localhost:50053',
  },
}; 