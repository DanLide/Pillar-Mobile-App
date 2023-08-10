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
      <View style={styles.orderSettings}>
        <Text style={styles.orderSettingsLabel}>Order Settings</Text>
        <View style={styles.minMaxContainer}>
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
    </>
  );
});

const styles = StyleSheet.create({
  inventoryTypes: {
    alignSelf: 'center',
  },
  orderSettings: {
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral40,
    borderTopWidth: 1,
    borderTopColor: colors.neutral40,
    gap: 24,
    paddingVertical: 24,
  },
  orderSettingsLabel: {
    alignSelf: 'center',
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 16,
    lineHeight: 20,
  },
  minMaxContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  slash: {
    color: colors.grayDark3,
    fontFamily: fonts.TT_Light,
    fontSize: 44,
    paddingTop: 16,
  },
});
