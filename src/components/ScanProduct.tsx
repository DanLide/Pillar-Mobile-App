import React, { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  LayoutChangeEvent,
  LayoutRectangle,
  Dimensions,
  View,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSwitchState } from '../hooks';
import { Button } from './';
import Scanner from './Scanner';
import { SVGs } from '../theme';

import { Barcode } from 'vision-camera-code-scanner';
import { Frame } from 'react-native-vision-camera';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

type ScanProduct = {
  onPressScan: (code: Barcode['content']['data']) => void;
  isActive?: boolean;
};

const TIMEOUT = 500

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const QRIconSize = 24


const QARButton = ({
  index,
  cordinates,
  scanlineLayout,
  isSelected,
  onPress,
  disabled,
}:
  {
    barcode: Barcode,
    scanlineLayout: LayoutRectangle
    onPress: () => void
    index: number
    isSelected?: boolean
    disabled: boolean
  }
) => {
  const animatedStyleButton = useAnimatedStyle(() => {
    if (!cordinates?.value?.[index]) return {}

    const { left, right, bottom, top } = cordinates?.value[index]

    const isAvailable = scanlineLayout.y >= top && scanlineLayout.y <= bottom

    return {
      height: bottom - top,
      width: right - left,
      transform: [{ translateX: left }, { translateY: top }],
      borderColor: isAvailable ? '#00FD92' : '#FFC156'
    };
  }, []);

  const animatedStyleIcon = useAnimatedStyle(() => {
    if (!cordinates?.value?.[index]) return {}

    const { bottom, top } = cordinates?.value[index]

    const height = (bottom - top) / 2
    const scale = height / QRIconSize

    return {
      transform: [{ scale }],
    };
  }, []);


  return (
    <AnimatedPressable
      style={[
        styles.scanBorder,
        animatedStyleButton,
        isSelected ? {
          backgroundColor: 'rgba(150,87,217,0.5)',
          borderColor: '#9657D9'
        } : {}
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[styles.iconWrapper, animatedStyleIcon]}>
        <SVGs.QRIcon width={QRIconSize} height={QRIconSize} />
      </Animated.View>
    </AnimatedPressable>
  )
}

const ScanProduct: React.FC<ScanProduct> = ({ onPressScan, isActive }) => {
  const frameRef = useRef<Frame | null>(null);
  const scannerLayoutRef = useRef<LayoutRectangle | null>(null);
  const scanLineLayoutRef = useRef<LayoutRectangle | null>(null);
  const timer = useRef(null)
  const borcodesRef = useRef(null)

  const [barcodesInFocus, setBarcodesInFocus] = useState<null | Barcode[]>([])
  const [isBarcodesInFrame, setIsBarcodesInFrame] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null)

  const [isTorchOn, toggleIsTorchOn] = useSwitchState();
  const { top } = useSafeAreaInsets();
  const barcodesSharedValue = useSharedValue(null)


  const onRead = (barcodes, frame) => {
    if (!frame || !scannerLayoutRef.current) {
      return
    }

    frameRef.current = frame;
    borcodesRef.current = barcodes


    const coordinates = barcodes.map((barcode) => {
      const xRatio = frame.width / scannerLayoutRef.current.width;
      const yRatio = frame.height / scannerLayoutRef.current.height;
      const xArray = barcode.cornerPoints?.map(corner => corner.x);
      const yArray = barcode.cornerPoints?.map(corner => corner.y);

      const left = Math.min(...xArray) / xRatio;
      const right = Math.max(...xArray) / xRatio;
      const bottom = Math.max(...yArray) / yRatio;
      const top = Math.min(...yArray) / yRatio;

      return { left, right, bottom, top };
    })

    barcodesSharedValue.value = coordinates

    const _barcodesInFocus = barcodes.filter((_, index) => {
      return scanLineLayoutRef.current.y >= coordinates[index]?.top && scanLineLayoutRef.current.y <= coordinates[index]?.bottom;
    })

    if (barcodesInFocus.length !== _barcodesInFocus.length) {
      setBarcodesInFocus(_barcodesInFocus)
      setSelectedIndex(null)
    }

    if (!isBarcodesInFrame && barcodes.length) {
      // qr appears
      setIsBarcodesInFrame(true)
      return
    }



    if (isBarcodesInFrame && !barcodes.length && timer.current === null) {
      // qr missed and, the reason could be there no qr, or it was not read by scanner library, 
      // if this issue from the in next if it will cancel in next if
      timer.current = setTimeout(() => {
        setIsBarcodesInFrame(false)
        timer.current = null
      }, TIMEOUT)
      return
    }

    if (barcodes.length && timer.current !== null) {
      // if qr back to frame erlier that timeout clear timer
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  const onLayoutScanner = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    scannerLayoutRef.current = nativeEvent.layout;
  }, []);

  const onLayoutScanLine = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      scanLineLayoutRef.current = nativeEvent.layout;
    },
    [],
  );

  const isScanButtonDisabled = selectedIndex === null && barcodesInFocus.length !== 1 ;

  const onPressScanButton = () => {
    const index = selectedIndex === null ? 0 : selectedIndex
    const data = borcodesRef?.current?.[index]?.content?.data;
    data && onPressScan(data);
  };

  const torchButtonStyle = [styles.torch, { top }, isTorchOn && styles.torchOn]

  const renderBarcodes = () => borcodesRef.current?.map(
    (barcodeData, index) => {
      if (!barcodeData || !barcodesSharedValue.value) return null;

      const onPress = () => {
        const data = barcodeData.content.data
        setSelectedIndex(index)
        if (barcodesInFocus.length === 1 && data) {
          onPressScan(data);
        }
      };

      const isOnScanLine = barcodesInFocus.some((currentBarcode) => {
        return JSON.stringify(currentBarcode.content) === JSON.stringify(barcodeData.content)
      })

      return (
        <QARButton
          key={index + 'barcodeFrame'}
          index={index}
          cordinates={barcodesSharedValue}
          scanlineLayout={scanLineLayoutRef.current}
          onPress={onPress}
          isSelected={index === selectedIndex}
          disabled={!isOnScanLine}
        />
      )
    });

  return (
    <View style={styles.container}>
      <View style={[styles.scanner]}>
        <Scanner
          torch={isTorchOn ? 'on' : 'off'}
          style={styles.scanner}
          onRead={onRead}
          isCamera
          isActive={isActive}
          onLayout={onLayoutScanner}
        />
      </View>
      <View style={styles.shadow} />
      <View style={styles.scanline} onLayout={onLayoutScanLine} />
      <View
        style={[styles.shadow, styles.bottomShadow]}
      />
      <Button
        title="Scan Product"
        buttonStyle={[styles.scanButton]}
        disabled={isScanButtonDisabled}
        onPress={onPressScanButton}
        isAnimated
      />
      {renderBarcodes()}
      <Button
        title="Torch"
        buttonStyle={torchButtonStyle}
        onPress={toggleIsTorchOn}
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
    backgroundColor: '#E0000F',
    marginHorizontal: 24,
    opacity: 0.8,
    marginTop: 'auto',
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },

  disabledButtonStyle: {
    opacity: 0.5,
  },
  shadow: {
    height: '30%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bottomShadow: {
    marginTop: 'auto',
  },
  torch: {
    position: 'absolute',
    left: 8,
    padding: 4,
    zIndex: 100,
  },
  torchOn: {
    backgroundColor: 'green',
    zIndex: 100,
  },
  scanButton: {
    top: '90%',
    position: 'absolute',
    alignSelf: 'center',
    width: '85%',
  },
  iconWrapper: {  
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9657D9',
    borderRadius: 10,
  },
  scanBorder: {
    borderRadius: 10,
    borderWidth: 5,
    borderColor: 'rgb(0, 210, 0)',
    position: 'absolute',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
