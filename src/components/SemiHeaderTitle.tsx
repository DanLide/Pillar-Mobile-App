import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

interface Props {
  title?: string;
}

const SemiHeaderTitle: React.FC<Props> = ({ title }) =>
  title ? (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  ) : null;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    padding: 9.5,
  },
  title: {
    fontSize: 18,
    lineHeight: 23.5,
    fontFamily: fonts.TT_Regular,
    color: colors.blackLight,
    alignSelf: 'center',
  },
});

export default memo(SemiHeaderTitle);
