import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
} from 'react';
import {
  StyleSheet,
  LayoutChangeEvent,
  LayoutRectangle,
  Dimensions,
  View,
  TouchableOpacity,
} from 'react-native'

import { Button } from './';
import Scanner, { ScannerProps } from './Scanner'

import { Barcode } from 'vision-camera-code-scanner'
import { Frame, } from 'react-native-vision-camera'

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

type ScanProduct = {
  onPressScan: (code: string) => void
}

const ScanProduct: React.FC<ScanProduct> = ({
  onPressScan,
}) => {
  const [barCodeData, setBarcodeData] = useState<null | Barcode[]>(null)

  const frameRef = useRef<Frame | null>(null)
  const scannerLayoutRef = useRef<LayoutRectangle | null>(null)

  const topShadowLayoutRef = useRef<LayoutRectangle | null>(null)
  const bottomShadowLayoutRef = useRef<LayoutRectangle | null>(null)

  const shadowHeight = topShadowLayoutRef.current?.height
  const topLimit = shadowHeight
  const bottomLimit = bottomShadowLayoutRef.current?.y

  const getCodeCoordinates = (barcode: Barcode) => {
    if (!frameRef.current || !scannerLayoutRef.current || !barcode.cornerPoints) return

    const frame = frameRef.current

    const xRatio = frame.width / scannerLayoutRef.current?.width;
    const yRatio = frame.height / scannerLayoutRef.current?.height;

    const cornerPoints = barcode.cornerPoints;

    const xArray = cornerPoints?.map(corner => corner.x);
    const yArray = cornerPoints?.map(corner => corner.y);

    const left = Math.min(...xArray) / xRatio
    const right = Math.max(...xArray) / xRatio
    const bottom = Math.max(...yArray) / yRatio
    const top = Math.min(...yArray) / yRatio


    return { left, right, bottom, top, ...barcode }
  }
  const barCodeDataWithCoordinates = useMemo(() => {
    return barCodeData?.map(getCodeCoordinates) || []
  }, [frameRef.current])

  const onRead = useCallback<ScannerProps['onRead']>((barcodes, frame) => {
    setBarcodeData(barcodes)
    frameRef.current = frame
  }, []
  )

  const onLayoutScanner = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    scannerLayoutRef.current = nativeEvent.layout
  }, []
  )

  const onLayoutTopShadow = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    topShadowLayoutRef.current = nativeEvent.layout
  }, []
  )

  const onLayoutBottomShadow = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    bottomShadowLayoutRef.current = nativeEvent.layout
  }, []
  )
 
  const barcodesInRange = barCodeDataWithCoordinates.filter((barcode) => { 
    return !(barcode?.top < topLimit || barcode?.bottom > bottomLimit)
  })

  const isScanButtonDisabled = barcodesInRange.length !== 1


const onPressScanButton = () => {
  const code = barCodeDataWithCoordinates?.[0]?.content?.rawValue
  code && onPressScan(code)
}

const renderBarcodes = () => {
  return barCodeDataWithCoordinates.map((barcodeData, index) => {
    if (!barcodeData) return null
    const { top, left, right, bottom, content } = barcodeData

    const disabled = top < topLimit || bottom > bottomLimit

    const onPress = () => {
      onPressScan(content?.rawValue)
    }

    return (
      <TouchableOpacity
        key={index + 'barcodeFrame'}
        style={[
          styles.scanBorder,
          {
            height: bottom - top,
            width: right - left,
            left,
            top,
          }
        ]}
        onPress={onPress}
        disabled={disabled}
      />
    )
  }
  )
}

return (
  <View style={styles.container}>
    <View style={[styles.scanner]}>
      <Scanner
        style={styles.scanner}
        onRead={onRead}
        isCamera
        isActive
        onLayout={onLayoutScanner}
      />
      {
        renderBarcodes()
      }
    </View>
    <View style={styles.shadow} onLayout={onLayoutTopShadow} />
    <View style={[styles.shadow, styles.bottomShadow,]} onLayout={onLayoutBottomShadow} />
    <Button
      title='Scan Product'
      buttonStyle={styles.scanButton}
      disabled={isScanButtonDisabled}
      onPress={onPressScanButton}
    />
  </View>
);
};

export default ScanProduct

const styles = StyleSheet.create({
  scanner: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    position: 'absolute',
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  bottomShadow: {
    marginTop: 'auto',
  },
  scanButton: {
    top: '90%',
    position: 'absolute',
    alignSelf: 'center',
    width: '85%',
  },
  scanBorder: {
    borderRadius: 10,
    borderWidth: 5,
    borderColor: 'rgb(0, 210, 0)',
    position: 'absolute',
    zIndex: 100,
  }
});