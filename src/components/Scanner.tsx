import React, { type PropsWithChildren, useState } from 'react';
import { View, ViewStyle, Text, StyleSheet, TouchableOpacity } from 'react-native'
import QRCodeScanner, { RNQRCodeScannerProps } from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'

interface ScannerProps extends RNQRCodeScannerProps {
  isCamera: boolean
  containerStyle?: ViewStyle
  onPressClose: () => void
}

const Scanner: React.FC<ScannerProps> = ({ isCamera, containerStyle, onPressClose, ...props }) => {

  const renderCamera = isCamera ?
    <QRCodeScanner
      {...props}
      flashMode={RNCamera.Constants.FlashMode.torch}
      focusDepth={1}
    /> :
    null

  return <View style={containerStyle}>
    <TouchableOpacity style={styles.buttonContainer} onPress={onPressClose}>
      <Text style={styles.close}>X</Text>
    </TouchableOpacity>
    {renderCamera}
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
  }
});

export default Scanner