import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LottieView from 'lottie-react-native';
import { colors } from 'src/theme';

interface Props {
  visible: boolean;
}

export const Spinner: FC<Props> = ({ visible }) => {
  return visible ? (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <View style={styles.spinnerContainer}>
          <LottieView
            style={styles.lottie}
            source={require('../../assets/animations/spinner.json')}
            autoPlay
            loop
          />
          <Text style={styles.text}>Loading...</Text>
        </View>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  spinnerContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    width: 240,
    height: 172,
  },
  lottie: {
    marginHorizontal: 60,
    marginTop: 20,
    marginBottom: 8,
    width: 70,
    height: 70,
  },
  text: {
    fontSize: 17,
    marginBottom: 20,
  },
});
