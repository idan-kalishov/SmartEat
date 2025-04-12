// grpc.config.ts
import { Transport, ClientProviderOptions } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientProviderOptions = {
  name: 'NUTRITION_RECOMMENDATION_SERVICE', // Required identifier
  transport: Transport.GRPC,
  options: {
    package: 'nutrition', // Must match proto package
    protoPath: join(__dirname, 'proto/nutrition.proto'),
    url: 'localhost:50051', // gRPC server address
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: [join(__dirname, 'proto')], // Add this line
    },
  },
};
