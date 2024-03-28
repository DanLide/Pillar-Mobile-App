import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '../../theme';

interface Props {
  title: string;
}

export const TitleBar: React.FC<Props> = ({ title }) => (
  <Text style={styles.title}>{title}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 19,
    lineHeight: 26,
    fontFamily: fonts.TT_Bold,
    color: colors.white,
  },
});
