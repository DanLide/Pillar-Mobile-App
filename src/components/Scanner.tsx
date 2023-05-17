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
  useCameraFormat,
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
const VIDEO_HEIGHT = 720

const Scanner: React.FC<ScannerProps> = ({
  isActive = true,
  onRead,
  ...props
}) => {
  const devices = useCameraDevices();
  const device = devices.back;

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

  const formatsWidthNeedWidth = device?.formats.filter((item) => item.videoHeight === VIDEO_HEIGHT || item.videoWidth === VIDEO_HEIGHT)
  const format = formatsWidthNeedWidth?.sort((a, b) => { return a.photoWidth - b.photoWidth })?.[0]

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
      {...props}
      device={device}
      format={format}
      fps={20}
      enableHighQualityPhotos
      enableDepthData
    />
  );
};

Scanner.displayName = 'Scanner';

export default React.memo(Scanner);
