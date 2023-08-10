import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import { find, whereEq } from 'ramda';

import { categoriesStore } from '../../../stores';
import { ProductModel } from '../../../stores/types';
import {
  Dropdown,
  DropdownItem,
  InventoryTypeBadge,
  Tooltip,
} from '../../../components';
import { InventoryUseType } from '../../../constants/common.enum';
import { colors, fonts } from '../../../theme';
import { EditQuantity } from '../../productModal/components/quantityTab';
import { getProductMinQty } from '../../../data/helpers';

interface Props {
  product?: ProductModel;
}

const inventoryTypes = [
  InventoryUseType.Each,
  InventoryUseType.NonStock,
  InventoryUseType.Container,
  InventoryUseType.Percent,
];

const MAX_VALUE = 99999;
const MIN_VALUE = 0;

export const EditProduct = observer(({ product }: Props) => {
  const [categoryId, setCategoryId] = useState(product?.categoryId);

  const stepValue = getProductMinQty(product?.inventoryUseTypeId);

  const categories = useMemo<DropdownItem[]>(
    () =>
      categoriesStore.categories.map(item => ({
        label: item.description,
        value: item.id,
      })),
    [],
  );

  const category = useMemo(
    () => find(whereEq({ value: categoryId }), categories),
    [categories, categoryId],
  );

  const shipmentQuantityTooltip = useMemo(
    () => (
      <Text style={styles.tooltipMessage}>
        <Text style={[styles.tooltipMessage, styles.textBold]}>
          Shipment Quantity
        </Text>{' '}
        - The increment in which the product is shipped (i.e 4-pack)
      </Text>
    ),
    [],
  );

  const renderInventoryType = useCallback(
    (item: number) => <InventoryTypeBadge inventoryUseTypeId={item} />,
    [],
  );

  return (
    <>
      <Dropdown
        data={inventoryTypes}
        selectedItem={product?.inventoryUseTypeId}
        renderItem={renderInventoryType}
        label="Remove By"
        style={styles.inventoryTypes}
      />
      <Dropdown data={categories} selectedItem={category} label="Category" />
      <View style={styles.orderSection}>
        <View style={styles.orderSettings}>
          <View style={styles.minMaxContainer}>
            <Text style={styles.orderSettingsLabel}>Order Settings</Text>
            <View style={styles.minMaxRow}>
              <EditQuantity
                vertical
                label="Minimum"
                currentValue={product?.min ?? 0}
                maxValue={MAX_VALUE}
                minValue={MIN_VALUE}
                stepValue={stepValue}
                initFontSize={28}
                onChange={console.log}
              />
              <Text style={styles.slash}>/</Text>
              <EditQuantity
                vertical
                label="Maximum"
                currentValue={product?.max ?? 0}
                maxValue={MAX_VALUE}
                minValue={MIN_VALUE}
                stepValue={stepValue}
                initFontSize={28}
                onChange={console.log}
              />
            </View>
          </View>
          <View style={styles.orderQuantities}>
            <EditQuantity
              vertical
              label="Pieces Per"
              labelWithNewLine="Container"
              currentValue={product?.unitsPerContainer ?? 0}
              maxValue={MAX_VALUE}
              minValue={MIN_VALUE}
              stepValue={stepValue}
              initFontSize={28}
              onChange={console.log}
            />
            <EditQuantity
              vertical
              label="Shipment"
              labelWithNewLine="Quantity"
              currentValue={product?.orderMultiple ?? 0}
              maxValue={MAX_VALUE}
              minValue={MIN_VALUE}
              stepValue={stepValue}
              initFontSize={28}
              onChange={console.log}
            />
            <EditQuantity
              disabled
              vertical
              label="On order"
              labelContainerStyle={styles.onOrderLabel}
              currentValue={product?.onOrder ?? 0}
              maxValue={MAX_VALUE}
              minValue={MIN_VALUE}
              stepValue={stepValue}
              initFontSize={28}
              onChange={console.log}
            />
          </View>
        </View>
        <Tooltip
          message={shipmentQuantityTooltip}
          contentStyle={styles.shipmentQuantity}
        >
          <Text style={styles.shipmentQuantityText}>
            What is Shipment Quantity?
          </Text>
        </Tooltip>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  inventoryTypes: {
    alignSelf: 'center',
  },
  onOrderLabel: {
    paddingVertical: 11,
  },
  orderQuantities: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  orderSection: {
    alignSelf: 'stretch',
    borderBottomColor: colors.neutral40,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: colors.neutral40,
    gap: 24,
    paddingVertical: 24,
  },
  orderSettings: {
    gap: 48,
    paddingHorizontal: 16,
  },
  orderSettingsLabel: {
    alignSelf: 'center',
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 16,
    lineHeight: 20,
  },
  minMaxContainer: {
    gap: 24,
  },
  minMaxRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  shipmentQuantity: {
    paddingVertical: 8,
  },
  shipmentQuantityText: {
    color: colors.purpleDark,
    fontFamily: fonts.TT_Bold,
    fontSize: 12,
    letterSpacing: 0.16,
    textAlign: 'center',
  },
  slash: {
    color: colors.grayDark3,
    fontFamily: fonts.TT_Light,
    fontSize: 44,
    paddingTop: 16,
  },
  tooltipMessage: {
    color: colors.grayDark3,
    flex: 1,
    fontFamily: fonts.TT_Regular,
    fontSize: 12,
    letterSpacing: 0.16,
    textAlign: 'left',
  },
  textBold: {
    fontFamily: fonts.TT_Bold,
  },
});
