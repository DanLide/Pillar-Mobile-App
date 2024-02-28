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
import { OrderType } from 'src/constants/common.enum';

interface Props extends ViewProps {
  orderType?: OrderType;
}

const purchaseOrderText = 'Total Cost';
const returnOrderText = 'Return Order Total';

export const TotalCostBar = observer(({ orderType, style }: Props) => {
  const ordersStoreRef = useRef(ordersStore).current;

  const isReturnOrder = orderType === OrderType.Return;
  const totalCost = ordersStoreRef.getTotalCost;

  const costSign = isReturnOrder && !!totalCost && '-';

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, style],
    [style],
  );

  return (
    <View style={containerStyle}>
      <Text style={styles.text}>
        {isReturnOrder ? returnOrderText : purchaseOrderText}:{' '}
      </Text>
      <Text style={styles.count}>
        {costSign}${totalCost.toFixed(2)}
      </Text>
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
