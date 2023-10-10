import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from 'src/theme';

export const Separator = memo(() => <View style={styles.separator} />);

const styles = StyleSheet.create({
  separator: { width: '100%', height: 1, backgroundColor: colors.gray },
});
