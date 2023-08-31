import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { observer } from 'mobx-react';
import { find, whereEq } from 'ramda';

import { categoriesStore, suppliersStore } from '../../../stores';
import {
  Button,
  ButtonType,
  Dropdown,
  DropdownItem,
  Input,
  InputType,
  InventoryTypeBadge,
  ScanProductProps,
  Switch,
  Tooltip,
} from '../../../components';
import { InventoryUseType } from '../../../constants/common.enum';
import { colors, fonts, SVGs } from '../../../theme';
import {
  EditQuantity,
  ProductQuantity,
} from '../../productModal/components/quantityTab';
import { getProductStepQty } from '../../../data/helpers';
import { manageProductsStore } from '../stores';
import { SvgProps } from 'react-native-svg';
import { ProductModalProps, ProductModalType } from '../../productModal';
import { UpcScanner } from './UpcScanner';

const inventoryTypes = [
  InventoryUseType.Each,
  InventoryUseType.NonStock,
  InventoryUseType.Container,
  InventoryUseType.Percent,
];

const MAX_VALUE = 9999;
const MIN_VALUE = 0;
const STEP_VALUE = 1;

const SCAN_ICON_PROPS: SvgProps = {
  height: 23.33,
  width: 32,
};

interface Props
  extends Pick<
    ProductModalProps,
    'product' | 'onHand' | 'maxValue' | 'toastType' | 'stockName'
  > {
  upcError?: string;
  onUpcChange?: (upc: string) => void;
  onToastAction?: () => void;
}

export const EditProduct = observer(
  ({
    product,
    onHand,
    maxValue,
    toastType,
    stockName,
    upcError,
    onUpcChange,
    onToastAction,
  }: Props) => {
    const store = useRef(manageProductsStore).current;
    const inputRef = useRef<TextInput | null>(null);

    const [isUpcActive, setIsUpcActive] = useState(false);

    const minQty = getProductStepQty(product?.inventoryUseTypeId);

    const keyboardType: KeyboardTypeOptions =
      product?.inventoryUseTypeId === InventoryUseType.Percent
        ? 'decimal-pad'
        : 'number-pad';

    const categories = useMemo<DropdownItem[]>(
      () =>
        categoriesStore.categories.map(item => ({
          label: item.description,
          value: item.id,
        })),
      [],
    );

    const category = useMemo<DropdownItem | undefined>(
      () => find(whereEq({ value: product?.categoryId }), categories),
      [categories, product?.categoryId],
    );

    const suppliers = useMemo<DropdownItem[]>(
      () =>
        suppliersStore.suppliers.map(item => ({
          label: item.name,
          value: item.partyRoleId,
        })),
      [],
    );

    const supplier = useMemo<DropdownItem | undefined>(
      () => find(whereEq({ value: product?.supplierPartyRoleId }), suppliers),
      [product?.supplierPartyRoleId, suppliers],
    );

    const enabledSuppliers = useMemo<DropdownItem[]>(
      () =>
        suppliersStore.enabledSuppliers.map(item => ({
          label: item.name,
          value: item.partyRoleId,
        })),
      [],
    );

    const enabledSupplier = useMemo<DropdownItem | undefined>(
      () =>
        find(whereEq({ value: product?.replenishedFormId }), enabledSuppliers),
      [enabledSuppliers, product?.replenishedFormId],
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

    const restockFromTooltip = useMemo(
      () => (
        <Text style={styles.tooltipMessage}>
          <Text style={[styles.tooltipMessage, styles.textBold]}>
            Restock From
          </Text>{' '}
          - Choose to replenish either from your distributor or from another
          Stock Location
        </Text>
      ),
      [],
    );

    const renderInventoryType = useCallback(
      (item: number) => <InventoryTypeBadge inventoryUseTypeId={item} />,
      [],
    );

    const handleUpcChange = useCallback(
      (upc: string) => {
        onUpcChange?.(upc);
        store.setUpc(upc);
      },
      [onUpcChange, store],
    );

    const onScanProduct = useCallback<ScanProductProps['onScan']>(
      async code => {
        if (typeof code === 'string') {
          handleUpcChange(code);
          inputRef?.current?.focus();
        }

        setIsUpcActive(false);
      },
      [handleUpcChange],
    );

    const onUpcClose = useCallback(() => setIsUpcActive(false), []);

    return (
      <>
        <ProductQuantity
          type={ProductModalType.ManageProduct}
          product={product}
          onChangeProductQuantity={quantity => store.setOnHand(quantity)}
          maxValue={maxValue ?? 0}
          minValue={0}
          onHand={onHand}
          toastType={toastType}
          onToastAction={onToastAction}
        />
        <Dropdown
          label="Remove By"
          data={inventoryTypes}
          selectedItem={product?.inventoryUseTypeId}
          renderItem={renderInventoryType}
          style={styles.inventoryTypes}
          onSelect={item => store.setInventoryType(item)}
        />
        <Dropdown
          label="Category"
          data={categories}
          selectedItem={category}
          style={styles.categories}
          onSelect={item => store.setCategory(+item.value)}
        />
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
                  minValue={minQty}
                  stepValue={minQty}
                  initFontSize={28}
                  keyboardType={keyboardType}
                  onChange={value => store.setMinValue(value)}
                />
                <Text style={styles.slash}>/</Text>
                <EditQuantity
                  vertical
                  label="Maximum"
                  currentValue={product?.max ?? 0}
                  maxValue={MAX_VALUE}
                  minValue={minQty}
                  stepValue={minQty}
                  initFontSize={28}
                  keyboardType={keyboardType}
                  onChange={value => store.setMaxValue(value)}
                />
              </View>
            </View>
            <View style={styles.orderQuantities}>
              {product?.inventoryUseTypeId === InventoryUseType.Each && (
                <EditQuantity
                  vertical
                  label="Pieces Per"
                  labelWithNewLine="Container"
                  currentValue={product?.unitsPerContainer ?? 0}
                  maxValue={MAX_VALUE}
                  minValue={MIN_VALUE}
                  stepValue={STEP_VALUE}
                  initFontSize={28}
                  keyboardType="number-pad"
                  onChange={value => store.setUnitsPerContainer(value)}
                />
              )}
              <EditQuantity
                vertical
                label="Shipment"
                labelWithNewLine="Quantity"
                currentValue={product?.orderMultiple ?? 0}
                maxValue={MAX_VALUE}
                minValue={MIN_VALUE}
                stepValue={STEP_VALUE}
                initFontSize={28}
                keyboardType="number-pad"
                onChange={value => store.setOrderMultiple(value)}
              />
              <EditQuantity
                disabled
                hideCount
                vertical
                label="On order"
                labelContainerStyle={styles.onOrderLabel}
                currentValue={product?.onOrder ?? 0}
                maxValue={MAX_VALUE}
                minValue={MIN_VALUE}
                stepValue={STEP_VALUE}
                initFontSize={28}
                keyboardType="number-pad"
                onChange={value => store.setOnOrder(value)}
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
        <View style={styles.bottomSection}>
          <Dropdown
            label="Distributor"
            data={suppliers}
            selectedItem={supplier}
            onSelect={item => store.setSupplier(+item.value)}
          />
          <View style={styles.spaceBetweenContainer}>
            <Dropdown
              label="Restock From"
              data={enabledSuppliers}
              selectedItem={enabledSupplier}
              style={styles.restockFromDropdown}
              onSelect={item => store.setRestockFrom(+item.value)}
            />
            <View style={styles.infoIconContainer}>
              <Tooltip message={restockFromTooltip} />
            </View>
          </View>
          <View style={styles.spaceBetweenContainer}>
            <Input
              keyboardType="number-pad"
              type={InputType.Primary}
              value={product?.upc}
              label="UPC Number"
              placeholder="Unassigned"
              error={upcError}
              ref={inputRef}
              containerStyle={styles.upcInput}
              onChangeText={handleUpcChange}
            />
            <Button
              title="Scan"
              type={ButtonType.secondary}
              icon={SVGs.CodeIcon}
              iconProps={SCAN_ICON_PROPS}
              buttonStyle={styles.scanButton}
              textStyle={styles.scanButtonText}
              onPress={() => setIsUpcActive(true)}
            />
          </View>
          <Switch
            trackColor={{ true: colors.purple }}
            value={product?.isRecoverable}
            label="Recoverable"
            labelStyle={styles.recoverableLabel}
            style={styles.spaceBetweenContainer}
            onPress={() => store.toggleIsRecoverable()}
          />
        </View>
        <UpcScanner
          isActive={isUpcActive}
          stockName={stockName}
          onScan={onScanProduct}
          onClose={onUpcClose}
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  bottomSection: {
    alignSelf: 'stretch',
    gap: 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  categories: {
    marginHorizontal: 16,
  },
  infoIconContainer: {
    justifyContent: 'center',
    height: 42,
    width: 42,
  },
  inventoryTypes: {
    alignSelf: 'center',
    minWidth: 150,
  },
  onOrderLabel: {
    paddingVertical: 11,
  },
  orderQuantities: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  recoverableLabel: {
    fontFamily: fonts.TT_Regular,
    fontSize: 16,
    lineHeight: 20,
  },
  restockFromDropdown: {
    flexGrow: 1,
  },
  scanButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  scanButtonText: {
    fontSize: 18,
    lineHeight: 27,
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
  spaceBetweenContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
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
  upcInput: {
    flexGrow: 1,
  },
});
