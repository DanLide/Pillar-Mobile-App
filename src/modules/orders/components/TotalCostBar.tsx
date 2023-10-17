import React, { useMemo, useRef } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { observer } from 'mobx-react';

import { ordersStore } from 'src/modules/orders/stores';
import { colors, fonts } from 'src/theme';

export const TotalCostBar = observer(({ style }: ViewProps) => {
  const ordersStoreRef = useRef(ordersStore).current;

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, style],
    [style],
  );

  return (
    <View style={containerStyle}>
      <Text style={styles.text}>Total Cost: </Text>
      <Text style={styles.count}>${ordersStoreRef.getTotalCost}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.purpleDark2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 48,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    color: colors.white,
    fontFamily: fonts.TT_Bold,
    fontSize: 16,
    lineHeight: 20,
  },
  count: {
    color: colors.white,
    fontFamily: fonts.TT_Bold,
    fontSize: 20,
    lineHeight: 24,
  },
});
