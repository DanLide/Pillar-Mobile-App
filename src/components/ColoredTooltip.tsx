import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { colors } from '../theme';

interface Props {
  title: string;
  textStyles: StyleProp<TextStyle>;
}

export const ColoredTooltip: React.FC<Props> = ({ title, textStyles }) => (
  <Text style={[styles.text, textStyles]}>{title}</Text>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: colors.green,
    backgroundColor: colors.greenLight,
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 1,
    paddingHorizontal: 13,
  },
});
