import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  LayoutChangeEvent,
  LayoutRectangle,
  View,
  ViewStyle,
} from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import {
  Barcode,
  BarcodeFormat,
  scanBarcodes,
} from 'vision-camera-code-scanner';
import {
  Camera,
  CameraDeviceFormat,
  CameraProps,
  Frame,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

export interface ScannerProps extends Partial<CameraProps> {
  isUPC?: boolean;
  containerStyle?: ViewStyle;
  onRead: (barcode: Barcode[], frame: Frame) => void;
}

const isIpod = Dimensions.get('screen').width <= 320;

const IPOD_WIDTH = 1920;
const IPHONE_WIDTH = 2592;
const VIDEO_WIDTH = isIpod ? IPOD_WIDTH : IPHONE_WIDTH;
const PIXEL_FORMAT = '420v';

const Scanner: React.FC<ScannerProps> = ({
  isActive = false,
  isUPC,
  onRead,
  ...props
}) => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef<Camera | null>(null);
  const format = useRef<CameraDeviceFormat | null>(null);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  // callback for analyze frame and filter code duplication
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if(!isActive) return

      const barcodes = scanBarcodes(
        frame,
        [isUPC ? BarcodeFormat.UPC_A : BarcodeFormat.ALL_FORMATS],
        {
          checkInverted: true,
        },
      );

      const filtered = barcodes.filter((value, index, self) => {
        return (
          self.findIndex(
            el =>
              JSON.stringify(el.rawValue) === JSON.stringify(value.rawValue),
          ) === index
        );
      });
      onRead && runOnJS(onRead)(filtered, frame);
    },
    [onRead],
  );

  const [hasPermission, setHasPermission] = React.useState(false);

  !format.current &&
    device?.formats.forEach(obj => {
      if (
        obj.videoWidth === VIDEO_WIDTH &&
        obj.pixelFormat === PIXEL_FORMAT &&
        obj.videoHeight > (format.current?.videoHeight || 0)
      ) {
        format.current = obj;
      }
    });

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (!layout) return;

    const point = {
      x: layout.width / 2,
      y: layout.height / 2,
    };
    const timerId = setInterval(() => {
      cameraRef.current?.focus(point);
    }, 500);

    return () => clearInterval(timerId);
  }, [layout]);

  const checkCameraPermission = async () => {
    const status = await Camera.getCameraPermissionStatus();
    setHasPermission(status === 'authorized');
  };

  if (!device) return <ActivityIndicator />;

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayout(event.nativeEvent.layout);
  };

  return (
    <View onLayout={handleLayout} style={{ flex: 1 }}>
      <Camera
        isActive={isActive}
        ref={cameraRef}
        frameProcessor={frameProcessor}
        audio={false}
        {...props}
        device={device}
        format={format.current || device?.formats[device?.formats.length - 1]}
        fps={30}
        enableHighQualityPhotos
        enableDepthData
      />
    </View>
  );
};

Scanner.displayName = 'Scanner';

export default React.memo(Scanner);
