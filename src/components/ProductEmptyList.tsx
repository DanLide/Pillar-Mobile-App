import React, { memo, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { colors, fonts, SVGs } from '../theme';

const ProductEmptyList: React.FC<ViewProps> = ({ style, ...props }) => {
  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, style],
    [style],
  );

  return (
    <View style={containerStyle} {...props}>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nothing here</Text>
        <SVGs.CodeIcon color={colors.black} style={styles.emptyContainerIcon} />
        <Text style={styles.emptyText}>Start Scanning</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: fonts.TT_Bold,
    lineHeight: 30,
    color: colors.black,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.125,
  },
  emptyContainerIcon: {
    marginVertical: 16,
  },
});

export default memo(ProductEmptyList);
