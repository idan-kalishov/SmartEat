import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const ExcerciseGrpcOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'exercise',
    protoPath: join(__dirname, '../proto/exercise.proto'),
    url: process.env.EXERCISE_SERVICE_URL || 'localhost:50055',
  },
};
