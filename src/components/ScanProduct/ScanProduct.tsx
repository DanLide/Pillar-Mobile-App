import { isNil, forEachObjIndexed } from 'ramda';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/default
import Animated, {
  FadeInUp,
  FadeOutDown,
  Layout,
  useSharedValue,
} from 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';
import { Frame } from 'react-native-vision-camera';
import { VolumeManager } from 'react-native-volume-manager';
import { Barcode } from 'vision-camera-code-scanner';

import { useSwitchState } from '../../hooks';
import { SVGs, colors } from '../../theme';
import ProductListButton from '../ProductListButton';
import Scanner from '../Scanner';
import { TooltipBar } from '../TooltipBar';
import {
  Coordinate,
  ScanProductProps,
  BarcodesMemoryStateItem,
} from './ScanProduct.types';
import {
  AUTOSCAN_TIMEOUT_MS,
  FLASH_TIME_MS,
  NORMAL_ZOOM,
  ZOOM_IN,
  LIMIT_SCAN_FREQUENCY_MS,
  BARCODE_LIFETIME_MS,
} from './ScanProduct.const';
import { HEIGHT, WIDTH, storageKeys } from 'src/constants';
import {
  CameraTip,
  CenterScanSquare,
  ClickIndicator,
  QRButton,
} from './components';
import { Spinner } from '../Spinner';
import { ScannerPlaceholderImage } from 'src/theme/svgs';
import { Spacer } from '../Spacer';
import { MMKWStorageService } from 'src/services';
import { useCaptuvoScanner } from 'src/libs';

const soundAndVibrate = async () => {
  await VolumeManager.setVolume(1);
  Vibration.vibrate();
  TrackPlayer.play();
};

export const ScanProduct: React.FC<ScanProductProps> = ({
  onScan,
  isActive,
  useScannerFlow = true, // captuvo scanner
  isUPC,
  scannedProductCount,
  tooltipText,
  filteredType,
  onProductsListPress,
  buttonListTitle,
}) => {
  const { t } = useTranslation();
  const frameRef = useRef<Frame | null>(null);
  const scannerLayoutRef = useRef<LayoutRectangle | null>(null);
  const ratio = useRef<number | null>(null);
  const widthCorrection = useRef<number | null>(null);
  const heightCorrection = useRef<number | null>(null);

  const [isTorchOn, toggleIsTorchOn] = useSwitchState();
  const [isZoomToggled, setIsZoomToggled] = useSwitchState();
  const [hideScannerTooltip, setScannerTooltip] = useState(
    !!MMKWStorageService.getRecord(storageKeys.HIDE_SCANNER_TOOLTIP),
  );
  const [barcodesLength, setBarcodesLength] = useState(0);
  const [autoScanDone, setAutoScanDone] = useState(false);
  const [isBlinkOn, setIsBlinkOn] = useState(false);
  const forceDisableScanner = useRef(false);
  const barcodesSharedValue = useSharedValue<Coordinate[]>([]);

  const scanSquareLayout = useRef<LayoutRectangle | null>(null);
  const barcodesState = useRef<Barcode[]>([]);
  const barcodesMemoryState = useRef<BarcodesMemoryStateItem>({});
  let previousScanTime = 0;
  let timeStampAutoScanFocus = 0;

  const onCloseTooltip = useCallback(() => {
    setScannerTooltip(true);
    MMKWStorageService.setRecord(
      storageKeys.HIDE_SCANNER_TOOLTIP,
      storageKeys.HIDE_SCANNER_TOOLTIP,
    );
  }, []);

  useEffect(() => {
    if (autoScanDone && isActive) {
      setAutoScanDone(false);
    }
  }, [isActive, autoScanDone]);

  useEffect(() => {
    if (isActive && forceDisableScanner.current) {
      forceDisableScanner.current = false;
    }
  }, [isActive, forceDisableScanner]);

  useEffect(() => {
    if (isBlinkOn) {
      setTimeout(() => {
        setIsBlinkOn(false);
      }, FLASH_TIME_MS);
    }
  }, [isBlinkOn]);

  const mapToScreenCoordinates = useCallback(
    (cornerPoints: Barcode['cornerPoints']) => {
      const frame = frameRef.current;

      // count ratio only once to save memory resource
      if (ratio.current === null) {
        const frameRatio = frame.height / frame.width;
        const previewRatio =
          scannerLayoutRef.current.height / scannerLayoutRef.current.width;

        // horizontal ratio
        const xRatio = frame.width / scannerLayoutRef.current.width;
        // vertical ratio
        const yRatio = frame.height / scannerLayoutRef.current.height;
        ratio.current = Math.min(xRatio, yRatio);

        // calculate correction because ration of width and height for frame and View different
        const isWidthAffected = frameRatio < previewRatio;

        if (isWidthAffected) {
          const expectedPreviewWidth =
            scannerLayoutRef.current.height / frameRatio;
          widthCorrection.current =
            (expectedPreviewWidth - scannerLayoutRef.current.width) / 2;
        } else {
          const expectedPreviewHeight =
            scannerLayoutRef.current.width * previewRatio;
          heightCorrection.current =
            (expectedPreviewHeight - scannerLayoutRef.current.height) / 2;
        }
      }

      const xArray = cornerPoints?.map(corner => corner.x);
      const yArray = cornerPoints?.map(corner => corner.y);

      const left =
        Math.min(...xArray) / ratio.current - widthCorrection.current;
      const right =
        Math.max(...xArray) / ratio.current - widthCorrection.current;
      const bottom =
        Math.max(...yArray) / ratio.current - heightCorrection.current;
      const top =
        Math.min(...yArray) / ratio.current - heightCorrection.current;

      return { left, right, bottom, top };
    },
    [],
  );

  const scanBarcode = (code?: string) => {
    if (!code) return;
    forceDisableScanner.current = true;
    soundAndVibrate();
    onScan(code);
    setIsBlinkOn(true);
  };

  const onRead = (barcodes: Barcode[], frame) => {
    const currentTime = new Date().getTime();

    // Limit scanning frequency
    const scanFrequency = Math.floor(currentTime / LIMIT_SCAN_FREQUENCY_MS);
    if (previousScanTime !== scanFrequency) {
      previousScanTime = scanFrequency;
    } else {
      return false;
    }

    // Return if no barcodes
    if (
      !frame ||
      !scannerLayoutRef.current ||
      (barcodes.length === 0 && barcodesState.current.length === 0) ||
      forceDisableScanner.current
    ) {
      !barcodesLength && setBarcodesLength(0);
      return;
    }

    frameRef.current = frame;

    // Stabilize scanning codes
    barcodesState.current = [];
    barcodes.forEach(barcode => {
      if (isNil(barcode.rawValue)) return;
      barcodesMemoryState.current[barcode.rawValue] = {
        barcode: barcode,
        time: currentTime,
      };
    });

    forEachObjIndexed(memoryBarcode => {
      if (currentTime - memoryBarcode.time < BARCODE_LIFETIME_MS) {
        barcodesState.current.push(memoryBarcode.barcode);
      }
    }, barcodesMemoryState.current);

    // need to rebuild react tree to mount/unmount elements
    setBarcodesLength(barcodesState.current.length);

    barcodesSharedValue.value = barcodesState.current?.map(barcode =>
      mapToScreenCoordinates(barcode.cornerPoints),
    );

    // autoscan logic below
    // reset timeStamp if another code appeared in Frame
    if (barcodesState.current.length !== 1) {
      timeStampAutoScanFocus = 0;
      return;
    }

    const singleBarcodeState = barcodesState.current[0];
    const updatedCoordinate = barcodesSharedValue.value[0];

    const centerX =
      (updatedCoordinate?.right - updatedCoordinate?.left) / 2 +
      updatedCoordinate?.left;
    const centerY =
      (updatedCoordinate?.bottom - updatedCoordinate?.top) / 2 +
      updatedCoordinate?.top;

    const isBarcodeInCenter =
      centerX >= scanSquareLayout.current.x &&
      centerX <= scanSquareLayout.current.x + scanSquareLayout.current?.width &&
      centerY >= scanSquareLayout.current.y &&
      centerY <= scanSquareLayout.current.y + scanSquareLayout.current?.height;

    // reset, barcode moved from scan area
    if (!isBarcodeInCenter) {
      timeStampAutoScanFocus = 0;
      return;
    }

    // set time when frame qr`a state start satisfy to be autoscanned
    if (timeStampAutoScanFocus === 0) {
      timeStampAutoScanFocus = currentTime;
      return;
    }

    // autoscan
    if (currentTime - timeStampAutoScanFocus > AUTOSCAN_TIMEOUT_MS) {
      scanBarcode(singleBarcodeState?.rawValue);
      setAutoScanDone(true);
      timeStampAutoScanFocus = 0;
    }
  };

  const onLayoutScanner = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    scannerLayoutRef.current = nativeEvent.layout;
  }, []);

  const onLayoutScanSquare = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      scanSquareLayout.current = nativeEvent.layout;
    },
    [],
  );

  const renderBarcodes = () => {
    if (!barcodesLength) {
      return null;
    }
    return barcodesState.current?.map((barcodeData, index) => {
      if (!barcodeData) {
        return null;
      }
      const onPress = () => {
        scanBarcode(barcodeData.rawValue);
      };

      return (
        <QRButton
          key={index + 'barcodeFrame'}
          index={index}
          coordinates={barcodesSharedValue}
          onPress={onPress}
          isGreenBorder={autoScanDone}
          isDisabled={barcodesLength === 1}
          barcodeFormat={barcodeData.format}
        />
      );
    });
  };

  const { isLoading, isScannerReady, disableScanner } = useCaptuvoScanner({
    onDataReceived: onScan,
    useScannerFlow,
  });

  const getTooltipText = useMemo<string>(() => {
    if (isUPC) return t('scanUPC');

    return barcodesLength > 1
      ? t('tapCodeYouWantToScan')
      : t('pointCameraAtProductCode');
  }, [barcodesLength, isUPC, t]);

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      {!isScannerReady && !isLoading && (
        <>
          <TooltipBar
            title={tooltipText || getTooltipText}
            containerStyle={styles.tooltipContainer}
          />
          {isBlinkOn && (
            <Animated.View
              style={styles.isBlinkOn}
              layout={Layout.duration(FLASH_TIME_MS)}
              entering={FadeInUp}
              exiting={FadeOutDown}
            />
          )}
          <View style={styles.scanner}>
            <Scanner
              torch={isTorchOn ? 'on' : 'off'}
              zoom={isZoomToggled ? ZOOM_IN : NORMAL_ZOOM}
              style={styles.scanner}
              onRead={onRead}
              isActive={isActive}
              filteredType={filteredType}
              isUPC={isUPC}
              onLayout={onLayoutScanner}
            />
          </View>
          {renderBarcodes()}
          {barcodesLength < 2 && (
            <CenterScanSquare
              onLayoutScanSquare={onLayoutScanSquare}
              autoScanDone={autoScanDone}
            />
          )}
        </>
      )}
      {isScannerReady && (
        <>
          <ClickIndicator />
          <View style={styles.placeholderContainer}>
            <ScannerPlaceholderImage />
          </View>
          <Spacer flex={1} />
          {!hideScannerTooltip && <CameraTip onClose={onCloseTooltip} />}
        </>
      )}
      <View style={styles.buttonsContainer}>
        {isScannerReady && (
          <TouchableOpacity
            style={[styles.smallBottomButton, styles.switchToCameraBtn]}
            onPress={disableScanner}
          >
            <SVGs.CameraIcon width={36} height={36} color={colors.black} />
          </TouchableOpacity>
        )}
        {!isScannerReady && !isLoading && (
          <TouchableOpacity
            style={[
              styles.smallBottomButton,
              { backgroundColor: isTorchOn ? colors.purple : colors.white },
            ]}
            accessibilityLabel="flash"
          >
            {isTorchOn ? <SVGs.TorchIconActive /> : <SVGs.TorchIconPassive />}
          </TouchableOpacity>
        )}
        {isNil(scannedProductCount) ? null : (
          <ProductListButton
            containerStyle={styles.listButtonContainer}
            count={scannedProductCount}
            onPress={onProductsListPress}
            buttonListTitle={buttonListTitle}
          />
        )}
        {!isScannerReady && !isLoading && (
          <TouchableOpacity
            style={[
              styles.smallBottomButton,
              { backgroundColor: isZoomToggled ? colors.purple : colors.white },
            ]}
            onPress={setIsZoomToggled}
            accessibilityLabel="zoomIcon"
          >
            {isZoomToggled ? <SVGs.ZoomOutIcon /> : <SVGs.ZoomInIcon />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scanner: {
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
  },
  isBlinkOn: {
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
    backgroundColor: colors.white,
    zIndex: 100,
  },
  switchToCameraBtn: {
    backgroundColor: colors.white,
    padding: 4,
    height: 48,
    width: 48,
  },
  placeholderContainer: {
    top: -8,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  buttonsContainer: {
    bottom: 16,
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
    gap: 8,
    marginHorizontal: '10%',
    width: '100%',
  },
  smallBottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginVertical: 7,
    borderRadius: 8,
  },
  listButtonContainer: {
    flex: 1,
    marginRight: 4,
  },
  tooltipContainer: {
    position: 'absolute',
    top: 4,
    left: 4,
    margin: 0,
  },
});
