import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { colors, SVGs, fonts } from '../../../theme';

interface Props {
  onClose: () => void;
}

export const ModalHeader: React.FC<Props> = ({ onClose }) => (
  <View style={styles.container}>
    <View style={styles.icon}>
      <TouchableOpacity onPress={onClose}>
        <SVGs.CloseIcon color={colors.purpleDark} />
      </TouchableOpacity>
    </View>
    <Text style={styles.title}>Adjust Quantity</Text>
    <View style={styles.icon} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 11,
    marginHorizontal: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.TT_Regular,
    fontSize: 17,
    lineHeight: 20,
    color: colors.blackLight,
  },
  icon: {
    width: 15.2,
    height: 15.2,
  },
});
