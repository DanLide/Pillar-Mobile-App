import React, { useEffect, useRef, useState } from 'react';
import {
  ViewStyle,
  View,
  ActivityIndicator,
  LayoutChangeEvent,
  LayoutRectangle,
} from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import {
  scanBarcodes,
  BarcodeFormat,
  Barcode,
} from 'vision-camera-code-scanner';
import {
  useCameraDevices,
  useFrameProcessor,
  Frame,
  Camera,
  CameraProps,
  CameraDeviceFormat,
} from 'react-native-vision-camera';

export interface ScannerProps extends Partial<CameraProps> {
  containerStyle?: ViewStyle;
  onRead: (barcode: Barcode[], frame: Frame) => void;
}

const CAMERA_ZOOM = 1.5;
const VIDEO_WIDTH = 1920;
const PIXEL_FORMAT = '420v'

const Scanner: React.FC<ScannerProps> = ({
  isActive = true,
  onRead,
  ...props
}) => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef<Camera | null>(null);
  const format = useRef<CameraDeviceFormat | null>(null)
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    const barcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS], {
      checkInverted: true,
    });

    const filtered = barcodes.filter((value, index, self) => {
      return self.findIndex((el) => JSON.stringify(el.content.data) === JSON.stringify(value.content.data)) === index
    });
    onRead && runOnJS(onRead)(filtered, frame);
  }, [onRead]);

  const [hasPermission, setHasPermission] = React.useState(false);

  !format.current && device?.formats.forEach((obj) => {
    if (
      obj.videoWidth === VIDEO_WIDTH &&
      obj.pixelFormat === PIXEL_FORMAT &&
      obj.videoHeight > (format.current?.videoHeight || 0)) {
      format.current = obj;
    }
  })

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (!layout) return

    const point = {
      x: layout.width / 2,
      y: layout.height / 2
    };
    const timerId = setInterval(() => {
      cameraRef.current?.focus(point)
    }, 500);

    return () => clearInterval(timerId);
  }, [layout])

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
        ref={cameraRef}
        frameProcessor={frameProcessor}
        audio={false}
        zoom={CAMERA_ZOOM}
        isActive={isActive}
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
