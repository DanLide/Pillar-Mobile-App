import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import { find, whereEq } from 'ramda';

import {
  ProductQuantity,
  ProductModalProps,
  ProductModalType,
} from '../../productModal';
import { BadgeType, InfoBadge } from './InfoBadge';
import { InventoryUseType } from '../../../constants/common.enum';
import { categoriesStore, suppliersStore } from '../../../stores';
import { permissionProvider } from '../../../data/providers';
import { colors, fonts } from '../../../theme';

interface Props
  extends Pick<
    ProductModalProps,
    'product' | 'onHand' | 'maxValue' | 'toastType' | 'onChangeProductQuantity'
  > {
  onToastAction?: () => void;
}

export const ViewProduct = observer(
  ({
    product,
    onHand,
    maxValue,
    toastType,
    onToastAction,
    onChangeProductQuantity,
  }: Props) => {
    const canEditProduct = permissionProvider.canEditProduct();

    const category = useMemo(
      () =>
        find(whereEq({ id: product?.categoryId }), categoriesStore.categories),
      [product?.categoryId],
    );

    const supplier = useMemo(
      () =>
        find(
          whereEq({ partyRoleId: product?.supplierPartyRoleId }),
          suppliersStore.suppliers,
        ),
      [product?.supplierPartyRoleId],
    );

    const restockFrom = useMemo(
      () =>
        find(
          whereEq({ partyRoleId: product?.replenishedFormId }),
          suppliersStore.enabledSuppliers,
        ),
      [product?.replenishedFormId],
    );

    return (
      <>
        <ProductQuantity
          type={ProductModalType.ManageProduct}
          product={product}
          onChangeProductQuantity={onChangeProductQuantity}
          jobSelectable={false}
          toastType={toastType}
          maxValue={maxValue ?? 0}
          minValue={0}
          onHand={onHand}
          disabled={!canEditProduct}
          onToastAction={onToastAction}
        />
        <Text style={styles.category}>{category?.description}</Text>
        <View style={styles.minMaxContainer}>
          <InfoBadge
            type={BadgeType.Large}
            title="Minimum Quantity"
            subtitle={product?.min}
          />
          <Text style={styles.slash}>/</Text>
          <InfoBadge
            type={BadgeType.Large}
            title="Maximum Quantity"
            subtitle={product?.max}
          />
        </View>
        <View style={styles.orderSettings}>
          {product?.inventoryUseTypeId === InventoryUseType.Each && (
            <InfoBadge
              title="Pieces Per"
              titleWithNewLine="Container"
              subtitle={product?.unitsPerContainer}
            />
          )}
          <InfoBadge
            title="Shipment"
            titleWithNewLine="Quantity"
            subtitle={product?.orderMultiple ?? '-'}
          />
          <InfoBadge title="On Order" subtitle={product?.onOrder} />
        </View>
        <View style={styles.bottomInfo}>
          <InfoBadge
            type={BadgeType.Medium}
            title="Distributor"
            subtitle={supplier?.name}
          />
          <InfoBadge
            type={BadgeType.Medium}
            title="Restock From"
            subtitle={restockFrom?.name}
          />
          <InfoBadge
            type={BadgeType.Medium}
            title="UPC"
            subtitle={product?.upc || '-'}
          />
          <InfoBadge
            type={BadgeType.Medium}
            title="Recoverable"
            subtitle={product?.isRecoverable ? 'Yes' : 'No'}
          />
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  bottomInfo: {
    gap: 16,
  },
  buttonContainer: {
    flex: 1,
    height: 48,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    padding: 16,
    backgroundColor: colors.white,
  },
  category: {
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 20,
  },
  contentContainer: {
    gap: 24,
    paddingBottom: 56,
  },
  minMaxContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  orderSettings: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 40,
  },
  settings: {
    alignItems: 'center',
    gap: 24,
  },
  slash: {
    color: colors.grayDark3,
    fontFamily: fonts.TT_Light,
    fontSize: 44,
    paddingTop: 16,
  },
  titleContainer: {
    backgroundColor: colors.purpleLight,
    overflow: 'hidden',
    padding: 0,
  },
});
