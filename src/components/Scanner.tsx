import React, { useEffect } from 'react';
import { View, ViewStyle, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useScanBarcodes, BarcodeFormat, Barcode } from 'vision-camera-code-scanner';
import { useCameraDevices, Camera, CameraProps } from 'react-native-vision-camera';
interface ScannerProps extends CameraProps {
  isCamera: boolean
  containerStyle?: ViewStyle
  onRead?: (barcode: string) => void
  onPressClose: () => void
}

const Scanner: React.FC<ScannerProps> = ({ isCamera, containerStyle, onPressClose, onRead, ...props }) => {
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.ALL_FORMATS]);

  const [hasPermission, setHasPermission] = React.useState(false);
  const [isScanned, setIsScanned] = React.useState(false);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const status = await Camera.getCameraPermissionStatus();
    setHasPermission(status === 'authorized');
  };

  useEffect(() => {
    toggleActiveState();
  }, [barcodes]);

  const toggleActiveState = () => {
    if (barcodes.length && isScanned === false) {
      //setIsScanned(true)
      barcodes.forEach((scannedBarcode: Barcode) => {
        if (scannedBarcode.rawValue) {
          onRead && onRead(scannedBarcode.rawValue);
        }
      });
    }
  };

  if (!device) return <ActivityIndicator />;

  return <View style={containerStyle}>
    <TouchableOpacity style={styles.buttonContainer} onPress={onPressClose}>
      <Text style={styles.close}>X</Text>
    </TouchableOpacity>
    <Camera
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      frameProcessorFps={5}
      audio={false}
      {...props}
    />
  </View>
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1,
    left: 10,
    top: 5,
  },
  close: {
    fontSize: 20,
    padding: 5,
  },
});

export default Scanner