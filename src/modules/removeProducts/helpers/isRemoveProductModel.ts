import { RemoveProductModel } from '../stores/RemoveProductsStore';
import { ScanningProductModel } from '../stores/ScanningProductStore';

export function isRemoveProductModel(
  item?: ScanningProductModel | RemoveProductModel,
): item is RemoveProductModel {
  return !!(item as RemoveProductModel).uuid;
}
