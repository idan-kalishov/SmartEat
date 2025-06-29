import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const ExcerciseGrpcOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'watertmgmt',
    protoPath: join(__dirname, '../proto/excercise.proto'),
    url: process.env.WATER_TRACKING_SERVICE_URL || 'localhost:50055',
  },
};
