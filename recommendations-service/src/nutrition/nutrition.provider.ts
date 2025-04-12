// nutrition/nutrition.provider.ts
import { Provider } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

export const NUTRITION_SERVICE = 'NUTRITION_SERVICE';

export const NutritionProvider: Provider = {
  provide: 'NUTRITION_CLIENT',
  useFactory: (client: ClientGrpc) => {
    return client.getService('NutritionService');
  },
  inject: [NUTRITION_SERVICE],
};
