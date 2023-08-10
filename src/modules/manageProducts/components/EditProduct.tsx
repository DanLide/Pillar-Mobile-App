import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
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

interface Props {
  product?: ProductModel;
}

const inventoryTypes = [
  InventoryUseType.Each,
  InventoryUseType.NonStock,
  InventoryUseType.Container,
  InventoryUseType.Percent,
];

export const EditProduct = observer(({ product }: Props) => {
  const [categoryId, setCategoryId] = useState(product?.categoryId);

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
    </>
  );
});

const styles = StyleSheet.create({
  inventoryTypes: {
    alignSelf: 'center',
  },
});
