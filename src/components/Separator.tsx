import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from 'src/theme';

export enum WidthType {
  FullWidth,
  MajorPart,
}

interface Props {
  widthType?: WidthType;
}

export const Separator = memo(({ widthType }: Props) => {
  const width = useMemo(() => {
    switch (widthType) {
      case WidthType.MajorPart:
        return { width: '95%' };
      case WidthType.FullWidth:
      default:
        return { width: '100%' };
    }
  }, [widthType]);

  return <View style={[styles.separator, width]} />;
});

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.gray,
    marginLeft: 'auto',
  },
});
