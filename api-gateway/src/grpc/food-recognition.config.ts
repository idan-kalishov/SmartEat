import { Transport } from '@nestjs/microservices';
import { join } from 'path';

export const foodRecognitionGrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'foodrecognition',
    protoPath: join(__dirname, '../proto/food-recognition.proto'),
    url: 'localhost:50052',
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  },
} as const;
