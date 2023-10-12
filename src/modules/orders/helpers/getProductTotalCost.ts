import { ProductModel } from 'src/stores/types';

export const getProductTotalCost = ({
  reservedCount,
  cost,
}: ProductModel): number => (reservedCount ?? 0) * (cost ?? 0);
