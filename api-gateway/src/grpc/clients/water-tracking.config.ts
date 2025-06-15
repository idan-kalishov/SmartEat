import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const waterTrackingGrpcOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'watertmgmt',
    protoPath: join(__dirname, '../proto/water-tracking.proto'),
    url: process.env.WATER_TRACKING_SERVICE_URL || 'localhost:50054', // New port
  },
};
