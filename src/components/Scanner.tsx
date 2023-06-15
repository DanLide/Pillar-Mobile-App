import React, { useEffect, useRef } from 'react';
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
} from 'react-native-vision-camera';

export interface ScannerProps extends Partial<CameraProps> {
  containerStyle?: ViewStyle;
  onRead: (barcode: Barcode[], frame: Frame) => void;
}

const CAMERA_ZOOM = 1.5;
const VIDEO_WIDTH = 1920;

const Scanner: React.FC<ScannerProps> = ({
  isActive = true,
  onRead,
  ...props
}) => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef<Camera>(null);
  const timerId = useRef<NodeJS.Timer | null>(null);
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

  let neededFormat
  let maxHeight = 0;

  device?.formats.forEach((obj) => {
    if (obj.videoWidth === VIDEO_WIDTH && obj.pixelFormat === "420v" && obj.videoHeight > maxHeight) {
      neededFormat = obj;
      maxHeight = obj.videoHeight;
    }
  })

  useEffect(() => {
    checkCameraPermission();
    // clear timer on unRender
    ()=> timerId.current && clearInterval(timerId.current);
  }, []);


  const checkCameraPermission = async () => {
    const status = await Camera.getCameraPermissionStatus();
    setHasPermission(status === 'authorized');
  };

  if (!device) return <ActivityIndicator />;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    timerId.current = setInterval(() => {
      cameraRef.current?.focus({
        x: width / 2,
        y: height / 2
      })
    }, 1000);
  };

  return (
    <View onLayout={handleLayout} style={{flex:1}}>
      <Camera
        ref={cameraRef}
        frameProcessor={frameProcessor}
        audio={false}
        zoom={CAMERA_ZOOM}
        isActive={isActive}
        {...props}
        device={device}
        format={neededFormat}
        fps={20}
        enableHighQualityPhotos
        enableDepthData
      />
    </View>
  );
};

Scanner.displayName = 'Scanner';

export default React.memo(Scanner);
