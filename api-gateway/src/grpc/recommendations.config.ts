import { Transport } from '@nestjs/microservices';
import { join } from 'path';

export const recommendationsGrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'nutrition',
    protoPath: join(__dirname, '../proto/nutrition.proto'),
    url:
      process.env.RECOMMENDATIONS_SERVICE_URL ||
      'localhost:50051',
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  },
} as const;
