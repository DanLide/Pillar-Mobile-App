import { SharedValue } from 'react-native-reanimated';
import { Barcode, BarcodeFormat } from 'vision-camera-code-scanner';

export type ScanProductProps = {
  onScan: (code: Barcode['content']['data']) => void;
  filteredType?: BarcodeFormat;
  isActive?: boolean;
  useScannerFlow?: boolean;
  isUPC?: boolean;
  scannedProductCount?: number;
  tooltipText?: string;
  buttonListTitle?: string;
  onProductsListPress?: () => void;
};

export type Coordinate = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type QRButtonProps = {
  onPress: () => void;
  index: number;
  isDisabled: boolean;
  coordinates: SharedValue<Coordinate[]>;
  isGreenBorder: boolean;
  barcodeFormat: Barcode['format'];
};

export type BarcodesMemoryStateItem = {
  [key: string]: {
    barcode: Barcode;
    time: number;
  };
};
