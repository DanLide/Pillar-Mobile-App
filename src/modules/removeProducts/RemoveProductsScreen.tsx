import React from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';

import { Button } from '../../components';

export const RemoveProductsScreen = () => {
  const onScanProduct = () => {};

  const onCompleteRemove = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          To begin scanning products, simply tap on the camera button below.
        </Text>
      </View>

      <Button
        buttonStyle={styles.scanButton}
        textStyle={styles.scanButtonText}
        title="SCAN PRODUCT"
        onPress={onScanProduct}
      />
      <Button
        buttonStyle={styles.button}
        title="COMPLETE REMOVE"
        onPress={onCompleteRemove}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  button: {
    margin: 12,
  },
  scanButton: {
    margin: 12,
    backgroundColor: 'transparent',
  },
  scanButtonText: {
    color: 'black',
  },
});
