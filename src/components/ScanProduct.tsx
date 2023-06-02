import React, { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  LayoutChangeEvent,
  LayoutRectangle,
  Dimensions,
  View,
  Pressable,
  TouchableOpacity,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import { Barcode, BarcodeFormat } from 'vision-camera-code-scanner';
import { Frame } from 'react-native-vision-camera';

import { useSwitchState } from '../hooks';
import Scanner from './Scanner';
import ProductListButton from './ProductListButton';
import { SVGs, TorchIconState, colors, fonts } from '../theme';
import { AppNavigator } from '../navigation';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

export type ScanProductProps = {
  onPressScan: (code: Barcode['content']['data']) => void;
  isActive?: boolean;
  scannedProductCount?: number;
};

const SCAN_PER_SECOND = 15;
const MISSED_BARCODE_LIMIT = 5;

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
  barcode: Barcode;
  scanlineLayout: LayoutRectangle;
  onPress: () => void;
  index: number;
  isSelected?: boolean;
  isDisabled: boolean;
  cordinates: SharedValue<Coordinate[]>;
  isGreenBorder: boolean;
  barcodeFormat: Barcode['format'];
};

type BarcodeStateItem = Barcode & {
  missedBarCodeCount: number;
  isSelected: boolean;
  isOnScanLine: boolean;
  isItemShouldBeDeleted: boolean;
};

const QRButton: React.FC<QRButtonProps> = ({
  index,
  cordinates,
  isSelected,
  onPress,
  isDisabled,
  isGreenBorder,
  barcodeFormat,
}) => {
  const Icon =
    barcodeFormat === BarcodeFormat.QR_CODE ? SVGs.QRIcon : SVGs.BarcodeIcon;

  const animatedStyleButton = useAnimatedStyle(() => {
    if (!cordinates?.value?.[index]) return {};

    const { left, right, bottom, top } = cordinates.value[index];

    return {
      height: bottom - top,
      width: right - left,
      transform: [{ translateX: left }, { translateY: top }],
    };
  }, []);

  const animatedStyleIcon = useAnimatedStyle(() => {
    if (!cordinates?.value?.[index]) return {};
    const { bottom, top } = cordinates.value[index];

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
        isSelected
          ? {
              backgroundColor: colors.purpleWithOpacity,
              borderColor: colors.purple,
            }
          : {
              borderColor: isGreenBorder ? colors.green2 : colors.yellow,
            },
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Animated.View style={[styles.iconWrapper, animatedStyleIcon]}>
        <Icon width={QRIconSize} height={QRIconSize} />
      </Animated.View>
    </AnimatedPressable>
  );
};

const getToolTipText = (barcodesOnScanLine, isSeletedBarcode) => {
  if (!barcodesOnScanLine.length) {
    return 'Point camera at product code';
  } else if (barcodesOnScanLine.length === 1) {
    return 'Tap on product code or Capture button to proceed';
  } else if (isSeletedBarcode) {
    return 'Tap on Capture button to proceed';
  } else if (barcodesOnScanLine.length > 1) {
    return 'Tap on product code to select it';
  }

  return '';
};

const ScanProduct: React.FC<ScanProductProps> = ({
  onPressScan,
  isActive,
  scannedProductCount,
}) => {
  const frameRef = useRef<Frame | null>(null);
  const scannerLayoutRef = useRef<LayoutRectangle | null>(null);
  const scanLineLayoutRef = useRef<LayoutRectangle | null>(null);
  const ratio = useRef<number | null>(null);
  const widthCorrection = useRef<number | null>(null);
  const heightCorrection = useRef<number | null>(null);
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const [barcodesState, setBarcodesState] = useState<BarcodeStateItem[]>([]);

  const [isTorchOn, toggleIsTorchOn] = useSwitchState();
  const barcodesSharedValue = useSharedValue<Coordinate[]>([]);

  const mapToScreenCoordinates = useCallback(cornerPoints => {
    const frame = frameRef.current;

    if (ratio.current === null) {
      const frameRatio = frame.height / frame.width;
      const previewRatio =
        scannerLayoutRef.current.height / scannerLayoutRef.current.width;

      const xRatio = frame.width / scannerLayoutRef.current.width;
      const yRatio = frame.height / scannerLayoutRef.current.height;
      ratio.current = Math.min(xRatio, yRatio);

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

    const left = Math.min(...xArray) / ratio.current - widthCorrection.current;
    const right = Math.max(...xArray) / ratio.current - widthCorrection.current;
    const bottom =
      Math.max(...yArray) / ratio.current - heightCorrection.current;
    const top = Math.min(...yArray) / ratio.current - heightCorrection.current;

    return { left, right, bottom, top };
  }, []);

  const onRead = (barcodes, frame) => {
    if (
      !frame ||
      !scannerLayoutRef.current ||
      (barcodes.length === 0 && barcodesState.length === 0)
    ) {
      return;
    }

    frameRef.current = frame;

    let needStateUpdate = false;
    const updatedCoordinates = [];

    for (let index = 0; index < barcodesState.length; index++) {
      const prevBarcode = barcodesState[index];
      const updatedBarcodeIndex = barcodes.findIndex(_barcode => {
        return (
          JSON.stringify(_barcode.content.data) ===
          JSON.stringify(prevBarcode.content.data)
        );
      });

      // because by default barcode object is freezed,
      // to see isNew barcode need rewrite barcode
      const updatedBarcode = { ...barcodes[updatedBarcodeIndex] };

      // barcode missed
      if (updatedBarcodeIndex === -1) {
        if (prevBarcode.missedBarCodeCount === MISSED_BARCODE_LIMIT - 1) {
          prevBarcode.isItemShouldBeDeleted = true;
          needStateUpdate = true;
        } else {
          prevBarcode.missedBarCodeCount++;
          updatedCoordinates.push(barcodesSharedValue.value[index]);
        }
        continue;
      }
      const updatedCoordinate = mapToScreenCoordinates(
        updatedBarcode.cornerPoints,
      );
      updatedCoordinates.push(updatedCoordinate);

      const isOnScanLine =
        scanLineLayoutRef.current.y >= updatedCoordinate?.top &&
        scanLineLayoutRef.current.y <= updatedCoordinate?.bottom;

      if (prevBarcode.isOnScanLine !== isOnScanLine) {
        needStateUpdate = true;
        prevBarcode.isOnScanLine = isOnScanLine;
      }

      updatedBarcode.isNew = false;
      barcodes[updatedBarcodeIndex] = updatedBarcode;
    }

    barcodesState.forEach((barcodeItem, index) => {
      barcodeItem.isItemShouldBeDeleted && barcodesState.splice(index, 1);
    });

    const newBarcodes = barcodes.filter(_barcode => {
      return _barcode.isNew !== false;
    });

    if (newBarcodes.length) {
      needStateUpdate = true;

      newBarcodes.forEach(_barcode => {
        const updatedCoordinate = mapToScreenCoordinates(_barcode.cornerPoints);
        updatedCoordinates.push(updatedCoordinate);
        const isOnScanLine =
          scanLineLayoutRef.current.y >= updatedCoordinate?.top &&
          scanLineLayoutRef.current.y <= updatedCoordinate?.bottom;
        barcodesState.push({
          ..._barcode,
          missedBarCodeCount: 0,
          isSelected: false,
          isItemShouldBeDeleted: false,
          isOnScanLine,
        });
      });
    }

    barcodesSharedValue.value = updatedCoordinates;

    if (needStateUpdate) {
      setBarcodesState([...barcodesState]);
    }
  };

  const onLayoutScanner = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    scannerLayoutRef.current = nativeEvent.layout;
  }, []);

  const onLayoutScanLine = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    scanLineLayoutRef.current = nativeEvent.layout;
  }, []);

  const selectedBarcode = barcodesState.find(barcode => barcode.isSelected);
  const barcodesOnScanLine = barcodesState.filter(
    barcode => barcode.isOnScanLine,
  );
  const isOneBarcodeOnScanLine = barcodesOnScanLine.length === 1;
  const isScanButtonDisabled = !selectedBarcode && !isOneBarcodeOnScanLine;

  const onPressScanButton = () => {
    const data = selectedBarcode
      ? selectedBarcode?.content?.data
      : barcodesOnScanLine?.[0].content?.data;
    data && onPressScan(data);
  };

  const renderBarcodes = () =>
    barcodesState?.map((barcodeData, index) => {
      if (!barcodeData) {
        return null;
      }
      const onPress = () => {
        const data = barcodeData.content.data;
        barcodesState.forEach(_barcode => (_barcode.isSelected = false));
        barcodeData.isSelected = true;

        setBarcodesState([...barcodesState]);
        if (isOneBarcodeOnScanLine && data) {
          onPressScan(data);
        }
      };

      return (
        <QRButton
          key={index + 'barcodeFrame'}
          index={index}
          cordinates={barcodesSharedValue}
          scanlineLayout={scanLineLayoutRef.current}
          onPress={onPress}
          isSelected={barcodeData.isSelected}
          isDisabled={!barcodeData.isOnScanLine}
          isGreenBorder={isOneBarcodeOnScanLine && barcodeData.isOnScanLine}
          barcodeFormat={barcodeData.format}
        />
      );
    });

  const renderToolTip = () => {
    return (
      <View style={styles.tooltipContainer}>
        <Text>{getToolTipText(barcodesOnScanLine, selectedBarcode)}</Text>
      </View>
    );
  };

  const renderTorchIcon = useCallback(
    ({ pressed }) => {
      const state = pressed
        ? TorchIconState.Pressed
        : isTorchOn
        ? TorchIconState.Active
        : TorchIconState.Passive;
      return <SVGs.TorchIcon state={state} />;
    },
    [isTorchOn],
  );

  return (
    <View style={styles.container}>
      {renderToolTip()}
      <View style={[styles.scanner]}>
        <Scanner
          torch={isTorchOn ? 'on' : 'off'}
          style={styles.scanner}
          onRead={onRead}
          isActive={isActive}
          onLayout={onLayoutScanner}
          frameProcessorFps={SCAN_PER_SECOND}
        />
      </View>
      <View style={styles.shadow} />
      <View style={styles.scanline} onLayout={onLayoutScanLine} />
      <View style={[styles.shadow, styles.bottomShadow]} />
      <TouchableOpacity
        onPress={() => navigation.navigate(AppNavigator.HowToScanScreen)}
        style={styles.questionMark}
      >
        <SVGs.QuestionMark color={colors.white} />
      </TouchableOpacity>
      {renderBarcodes()}
      <TouchableOpacity
        onPress={onPressScanButton}
        disabled={isScanButtonDisabled}
        style={[
          styles.scanButton,
          isScanButtonDisabled && styles.disabledStyle,
        ]}
      >
        <SVGs.CaptureIcon />
        <Text style={styles.captureText}>Capture</Text>
      </TouchableOpacity>
      <Pressable onPress={toggleIsTorchOn} style={styles.torch}>
        {renderTorchIcon}
      </Pressable>
      <ProductListButton
        containerStyle={styles.listButtonContainer}
        count={scannedProductCount}
      />
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
  tooltipContainer: {
    backgroundColor: colors.white2,
    borderRadius: 5,
    paddingVertical: 5,
    top: 4,
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
    width: '98%',
    alignItems: 'center',
  },
  shadow: {
    height: '30%',
    width: '100%',
    backgroundColor: colors.blackWidthOpacity,
  },
  bottomShadow: {
    marginTop: 'auto',
  },
  torch: {
    position: 'absolute',
    left: 10,
    top: 43,
    padding: 4,
    zIndex: 100,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  questionMark: {
    position: 'absolute',
    bottom: 23,
    left: 16,
  },
  scanButton: {
    bottom: 16,
    position: 'absolute',
    alignSelf: 'center',
    width: '64.8%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.purple,
    flexDirection: 'row',
    height: 56,
    borderRadius: 8,
    zIndex: 100,
  },
  listButtonContainer: {
    position: 'absolute',
    bottom: 23,
    right: 16,
  },
  iconWrapper: {
    width: 19,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
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
  },
});
