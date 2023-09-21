import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
import {
  StyleSheet,
  LayoutChangeEvent,
  LayoutRectangle,
  Dimensions,
  View,
  Pressable,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import Animated, {
  FadeOutDown,
  FadeInUp,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { Barcode, BarcodeFormat } from 'vision-camera-code-scanner';
import { Frame } from 'react-native-vision-camera';
import TrackPlayer from 'react-native-track-player';
import { VolumeManager } from 'react-native-volume-manager';
import { isNil } from 'ramda';

import { useSwitchState } from '../hooks';
import Scanner from './Scanner';
import ProductListButton from './ProductListButton';
import { SVGs, colors, fonts } from '../theme';
import { TooltipBar } from './TooltipBar';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const NORMAL_ZOOM = 1;
const ZOOM_IN = 1.5;
const SCAN_SQUARE_WIDTH = 48;
const DISSAPIERED_QR_CODE_DELAY_MS = 200;
const AUTOSCAN_TIMEOUT_MS = 200;
const BORDER_WIDTH = 3;
const FLASH_TIME_MS = 200;

export type ScanProductProps = {
  onScan: (code: Barcode['content']['data']) => void;
  isActive?: boolean;
  isUPC?: boolean;
  scannedProductCount?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const QRIconSize = 24;
const ScaleCoef = 2.2;

type Coordinate = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type QRButtonProps = {
  onPress: () => void;
  index: number;
  isDisabled: boolean;
  coordinates: SharedValue<Coordinate[]>;
  isGreenBorder: boolean;
  barcodeFormat: Barcode['format'];
};

type BarcodeStateItem = Barcode & {
  timeStampLastDetectionInFrame: Date;
  timeStampAutoscanFocus: Date | null;
};

const QRButton: React.FC<QRButtonProps> = ({
  index,
  coordinates,
  onPress,
  isDisabled,
  isGreenBorder,
  barcodeFormat,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const CenterIcon = isGreenBorder
    ? SVGs.CheckMark
    : barcodeFormat === BarcodeFormat.QR_CODE
    ? SVGs.QRIcon
    : SVGs.BarcodeIcon;

  const animatedStyleButton = useAnimatedStyle(() => {
    if (!coordinates?.value?.[index]) return {};

    const { left, right, bottom, top } = coordinates.value[index];

    return {
      height: bottom - top + 30,
      width: right - left + 30,
      transform: [{ translateX: left - 15 }, { translateY: top - 15 }],
    };
  }, []);

  const animatedStyleIcon = useAnimatedStyle(() => {
    if (!coordinates?.value?.[index]) return {};
    const { bottom, top } = coordinates.value[index];

    const height = (bottom - top) / ScaleCoef;
    const scale = height / QRIconSize;

    return {
      transform: [{ scale }],
    };
  }, []);

  return (
    <AnimatedPressable
      style={[
        styles.scanBorder,
        animatedStyleButton,
        (isPressed || isGreenBorder) && styles.greenBorder,
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Animated.View
        style={[
          styles.iconWrapper,
          animatedStyleIcon,
          !isGreenBorder && {
            backgroundColor: colors.white,
          },
        ]}
      >
        <CenterIcon width={QRIconSize} height={QRIconSize} />
      </Animated.View>
    </AnimatedPressable>
  );
};

const oneBarcodeToolTipText = 'Point camera at product code';
const multipleBarcodeToolTipText = 'Tap the code you want to scan';
const upcToolTipText = 'Scan UPC for product editing';

const soundAndVibrate = async () => {
  await VolumeManager.setVolume(1);
  Vibration.vibrate();
  TrackPlayer.play();
}

const ScanProduct: React.FC<ScanProductProps> = ({
  onScan,
  isActive,
  isUPC,
  scannedProductCount,
}) => {
  const frameRef = useRef<Frame | null>(null);
  const scannerLayoutRef = useRef<LayoutRectangle | null>(null);
  const ratio = useRef<number | null>(null);
  const widthCorrection = useRef<number | null>(null);
  const heightCorrection = useRef<number | null>(null);

  const [isTorchOn, toggleIsTorchOn] = useSwitchState();
  const [isZoomToggled, setIsZoomToggled] = useSwitchState();
  const [barcodesLength, setBarcodesLength] = useState(0);
  const [autoScanDone, setAutoScanDone] = useState(false);
  const [isBlinkOn, setIsBlinkOn] = useState(false);
  const forceDisableScanner = useRef(false);
  const barcodesSharedValue = useSharedValue<Coordinate[]>([]);

  const scanSquareLayout = useRef<LayoutRectangle | null>(null);
  const barcodesState = useRef<BarcodeStateItem[]>([]);

  useEffect(() => {
    if (autoScanDone && isActive) {
      setAutoScanDone(false);
    }
  }, [isActive, autoScanDone]);

  useEffect(() => {
    if (isActive && forceDisableScanner.current) {
      forceDisableScanner.current = false;
    }
  }, [isActive, forceDisableScanner])

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

    let isBarcodesLengthUpdated = false;
    const currentDate = new Date();

    // adding and updating existing barcodes status
    barcodes.forEach(updatedBarcode => {
      const barcodeForUpdatingIndex = barcodesState.current.findIndex(
        stateBarcode => {
          return stateBarcode.rawValue === updatedBarcode.rawValue;
        },
      );

      // updating existing barcodes status
      if (barcodeForUpdatingIndex !== -1) {
        barcodesState.current[barcodeForUpdatingIndex] = {
          ...barcodesState.current[barcodeForUpdatingIndex],
          ...updatedBarcode,
          timeStampLastDetectionInFrame: currentDate,
        };
      } else {
        // adding new barcode
        isBarcodesLengthUpdated = true;
        barcodesState.current.push({
          ...updatedBarcode,
          timeStampLastDetectionInFrame: currentDate,
          timeStampAutoscanFocus: null,
        });
      }
    });

    // filtering outdated codes
    barcodesState.current = barcodesState.current?.filter(barcode => {
      if (
        currentDate - barcode.timeStampLastDetectionInFrame >
        DISSAPIERED_QR_CODE_DELAY_MS
      ) {
        isBarcodesLengthUpdated = true;
        return false;
      }
      return true;
    });

    // need to rebuild react tree to mount/unmount elements
    isBarcodesLengthUpdated && setBarcodesLength(barcodes.length);

    barcodesSharedValue.value = barcodesState.current?.map(barcode =>
      mapToScreenCoordinates(barcode.cornerPoints),
    );

    // autoscan logic below
    // reset timeStamp if another code appeared in Frame
    if (barcodesState.current.length !== 1) {
      barcodesState.current.forEach(e => {
        e.timeStampAutoscanFocus = null;
      });
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
      singleBarcodeState.timeStampAutoscanFocus = null;
      return;
    }

    // set time when frame qr`a state start satisfy to be autoscanned
    if (singleBarcodeState.timeStampAutoscanFocus === null) {
      singleBarcodeState.timeStampAutoscanFocus = currentDate;
      return;
    }

    // autoscan
    if (
      singleBarcodeState.timeStampAutoscanFocus &&
      currentDate - singleBarcodeState.timeStampAutoscanFocus >
        AUTOSCAN_TIMEOUT_MS
    ) {
      scanBarcode(singleBarcodeState?.rawValue);
      setAutoScanDone(true);
      singleBarcodeState.timeStampAutoscanFocus = null;
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

  const onPressZoom = () => {
    setIsZoomToggled();
  };

  const tooltipText = useMemo<string>(() => {
    if (isUPC) return upcToolTipText;

    return barcodesLength > 1
      ? multipleBarcodeToolTipText
      : oneBarcodeToolTipText;
  }, [barcodesLength, isUPC]);

  const renderCenterScanSquare = useMemo(
    () => (
      <View style={styles.centreSquareWrapper}>
        <View
          onLayout={onLayoutScanSquare}
          style={styles.centreSquareContainer}
        >
          <View
            style={[
              styles.baseScanSquareStyle,
              styles.topLeft,
              autoScanDone && styles.greenBorder,
            ]}
          />
          <View
            style={[
              styles.baseScanSquareStyle,
              styles.topRight,
              autoScanDone && styles.greenBorder,
            ]}
          />
          <View
            style={[
              styles.baseScanSquareStyle,
              styles.bottomRight,
              autoScanDone && styles.greenBorder,
            ]}
          />
          <View
            style={[
              styles.baseScanSquareStyle,
              styles.bottomLeft,
              autoScanDone && styles.greenBorder,
            ]}
          />
        </View>
      </View>
    ),
    [onLayoutScanSquare, autoScanDone],
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

  return (
    <View style={styles.container}>
      <TooltipBar
        title={tooltipText}
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
      <View style={[styles.scanner]}>
        <Scanner
          torch={isTorchOn ? 'on' : 'off'}
          zoom={isZoomToggled ? ZOOM_IN : NORMAL_ZOOM}
          style={styles.scanner}
          onRead={onRead}
          isActive={isActive}
          isUPC={isUPC}
          onLayout={onLayoutScanner}
        />
      </View>
      {renderBarcodes()}
      {barcodesLength < 2 && renderCenterScanSquare}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.smallBottomButton,
            { backgroundColor: isTorchOn ? colors.purple : colors.white },
          ]}
          onPress={toggleIsTorchOn}
        >
          {isTorchOn ? <SVGs.TorchIconActive /> : <SVGs.TorchIconPassive />}
        </TouchableOpacity>
        {isNil(scannedProductCount) ? (
          <View />
        ) : (
          <ProductListButton
            containerStyle={styles.listButtonContainer}
            count={scannedProductCount}
          />
        )}
        <TouchableOpacity
          style={[
            styles.smallBottomButton,
            { backgroundColor: isZoomToggled ? colors.purple : colors.white },
          ]}
          onPress={onPressZoom}
        >
          {isZoomToggled ? <SVGs.ZoomOutIcon /> : <SVGs.ZoomInIcon />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScanProduct;

const styles = StyleSheet.create({
  scanner: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    position: 'absolute',
  },
  isBlinkOn: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    position: 'absolute',
    backgroundColor: colors.white,
    zIndex: 100,
  },
  scanline: {
    height: 5,
    backgroundColor: colors.red,
    marginHorizontal: 24,
    opacity: 0.8,
    marginTop: 'auto',
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
    borderRadius: 8,
  },
  listButtonContainer: {
    flex: 1,
    marginRight: 4,
  },
  iconWrapper: {
    width: 19,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.TT_Regular,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  disabledStyle: {
    backgroundColor: colors.purpleDisabled,
  },
  scanBorder: {
    borderRadius: 10,
    borderWidth: 5,
    position: 'absolute',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.yellow,
  },
  tooltipContainer: {
    position: 'absolute',
    top: 4,
    left: 4,
    margin: 0,
  },
  centreSquareWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centreSquareContainer: {
    aspectRatio: 1,
    width: WINDOW_WIDTH / 2,
    height: WINDOW_WIDTH / 2,
    position: 'absolute',
    alignSelf: 'center',
  },
  baseScanSquareStyle: {
    position: 'absolute',
    height: SCAN_SQUARE_WIDTH,
    width: SCAN_SQUARE_WIDTH,
    borderColor: colors.white,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderColor: colors.white,
    borderTopWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderTopLeftRadius: 25,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderTopRightRadius: 25,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderBottomLeftRadius: 25,
  },
  bottomRight: {
    bottom: 0,
    right: 0,

    borderBottomWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderBottomRightRadius: 25,
  },
  shadowScanBorderBase: {
    borderColor: colors.black,
  },
  topLeftShift: {
    top: BORDER_WIDTH,
    left: BORDER_WIDTH,
  },
  topRightShift: {
    top: BORDER_WIDTH,
    right: -BORDER_WIDTH,
  },
  bottomLeftShift: {
    bottom: -BORDER_WIDTH,
    left: BORDER_WIDTH,
  },
  bottomRightShift: {
    bottom: -BORDER_WIDTH,
    right: -BORDER_WIDTH,
  },
  greenBorder: {
    borderColor: colors.green5,
  },
});
