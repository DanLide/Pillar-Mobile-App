import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { colors, fonts } from '../theme';

interface Props {
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const InfoTitleBar: React.FC<Props> = ({ title, containerStyle }) => {
  const mergedStyle = useMemo(
    () => [styles.container, containerStyle],
    [containerStyle],
  );

  return title ? (
    <View style={mergedStyle}>
      <Text style={styles.title}>{title}</Text>
    </View>
  ) : null;
};

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

export default memo(InfoTitleBar);
