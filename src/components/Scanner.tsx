import React, { useEffect } from 'react';
import { ViewStyle, ActivityIndicator } from 'react-native';
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
  isCamera: boolean;
  containerStyle?: ViewStyle;
  onRead: (barcode: Barcode[], frame: Frame) => void;
}

const CAMERA_ZOOM = 1.5;

const Scanner: React.FC<ScannerProps> = ({
  isCamera,
  containerStyle,
  isActive = true,
  onRead,
  ...props
}) => {
  const devices = useCameraDevices();
  const device = devices.back;
  // const prevBarcodes = useRef<Barcode[]>([])
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

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const status = await Camera.getCameraPermissionStatus();
    setHasPermission(status === 'authorized');
  };

  if (!device) return <ActivityIndicator />;

  return (
    <Camera
      frameProcessor={frameProcessor}
      audio={false}
      zoom={CAMERA_ZOOM}
      isActive={isActive}
      frameProcessorFps={20}
      {...props}
      device={device}
    />
  );
};

Scanner.displayName = 'Scanner';

export default React.memo(Scanner);
