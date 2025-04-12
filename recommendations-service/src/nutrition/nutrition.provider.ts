// nutrition/nutrition.provider.ts
import { Provider } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

export const NUTRITION_RECOMMENDATION_SERVICE =
  'NUTRITION_RECOMMENDATION_SERVICE';

export const NutritionProvider: Provider = {
  provide: 'NUTRITION_CLIENT',
  useFactory: (client: ClientGrpc) => {
    return client.getService('NutritionsRatingService');
  },
  inject: [NUTRITION_RECOMMENDATION_SERVICE],
};
