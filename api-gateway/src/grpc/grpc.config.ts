import { Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'nutrition', // Matches the protobuf package name
    protoPath: join(__dirname, '../proto/nutrition.proto'), // Corrected file name
    url: 'localhost:50051',
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  },
} as const;
