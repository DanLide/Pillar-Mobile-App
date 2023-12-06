import React, { FC } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import LottieView from 'lottie-react-native';
import { colors } from 'src/theme';

interface Props {
  visible: boolean;
}

export const Spinner: FC<Props> = ({ visible }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
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
