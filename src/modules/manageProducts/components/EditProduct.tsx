import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { observer } from 'mobx-react';
import { find, whereEq } from 'ramda';

import { stocksStore } from '../../stocksList/stores';
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
import { InventoryUseType } from 'src/constants/common.enum';
import { colors, fonts, SVGs } from 'src/theme';
import { EditQuantity } from 'src/modules/productModal/components/quantityTab';
import { getProductStepQty } from 'src/data/helpers';
import { manageProductsStore } from '../stores';
import { ProductModalProps } from 'src/modules/productModal';
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

interface Props extends Pick<ProductModalProps, 'product' | 'stockName'> {
  unitsPerContainerError?: boolean;
  upcError?: string;
  onRemoveBySelect?: (removeBy: number) => void;
  onUnitsPerContainerChange?: (unitsPerContainer: number) => void;
  onUpcChange?: (upc: string) => void;
}

export const EditProduct = observer(
  forwardRef(
    (
      {
        product,
        stockName,
        unitsPerContainerError,
        upcError,
        onRemoveBySelect,
        onUnitsPerContainerChange,
        onUpcChange,
      }: Props,
      ref: React.ForwardedRef<TextInput>,
    ) => {
      const store = useRef(manageProductsStore).current;
      const inputRef = useRef<TextInput | null>(null);

      const [isUpcActive, setIsUpcActive] = useState(false);

      const minQty = getProductStepQty(product?.inventoryUseTypeId);

      const keyboardType: KeyboardTypeOptions =
        product?.inventoryUseTypeId === InventoryUseType.Percent
          ? 'decimal-pad'
          : 'number-pad';

      const isSpecialOrder =
        product?.inventoryUseTypeId === InventoryUseType.NonStock;

      const isEachPeace = product?.inventoryUseTypeId === InventoryUseType.Each;

      const isOnOrder = (product?.onOrder ?? 0) > 0;

      const categories = useMemo<DropdownItem[]>(
        () =>
          stocksStore.categories.map(item => ({
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
          stocksStore.suppliers.map(item => ({
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
          stocksStore.enabledSuppliers.map(item => ({
            label: item.name,
            value: item.partyRoleId,
          })),
        [],
      );

      const enabledSupplier = useMemo<DropdownItem | undefined>(
        () =>
          find(
            whereEq({ value: product?.replenishedFormId }),
            enabledSuppliers,
          ),
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
          <Dropdown
            label="Remove By"
            disabled={isOnOrder}
            data={inventoryTypes}
            selectedItem={product?.inventoryUseTypeId}
            renderItem={renderInventoryType}
            style={styles.inventoryTypes}
            onSelect={onRemoveBySelect}
          />
          <Dropdown
            label="Category"
            data={categories}
            selectedItem={category}
            style={styles.categories}
            onSelect={item => store.setCategory(+item.value)}
          />
          <View style={styles.orderSection}>
            <View style={styles.orderSettingsContainer}>
              <Text style={styles.orderSettingsLabel}>Order Settings</Text>
              <View style={styles.orderSettings}>
                {!isSpecialOrder && (
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
                )}
                <View style={styles.orderQuantities}>
                  {isEachPeace && (
                    <EditQuantity
                      vertical
                      label="Pieces Per"
                      labelWithNewLine="Container"
                      disabled={isOnOrder}
                      hideCount={isOnOrder}
                      currentValue={product?.unitsPerContainer ?? 0}
                      maxValue={MAX_VALUE}
                      minValue={MIN_VALUE}
                      stepValue={STEP_VALUE}
                      initFontSize={28}
                      keyboardType="number-pad"
                      error={unitsPerContainerError}
                      ref={ref}
                      onChange={onUnitsPerContainerChange}
                    />
                  )}
                  {!isSpecialOrder && (
                    <EditQuantity
                      vertical
                      label="Shipment"
                      labelWithNewLine="Quantity"
                      disabled={isOnOrder}
                      hideCount={isOnOrder}
                      currentValue={product?.orderMultiple ?? 0}
                      maxValue={MAX_VALUE}
                      minValue={MIN_VALUE}
                      stepValue={STEP_VALUE}
                      initFontSize={28}
                      keyboardType="number-pad"
                      onChange={value => store.setOrderMultiple(value)}
                    />
                  )}
                  <EditQuantity
                    disabled
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
              disabled={isOnOrder}
              data={suppliers}
              selectedItem={supplier}
              onSelect={item => store.setSupplier(+item.value)}
            />
            {!isSpecialOrder && (
              <View style={styles.spaceBetweenContainer}>
                <Dropdown
                  label="Restock From"
                  disabled={isOnOrder}
                  data={enabledSuppliers}
                  selectedItem={enabledSupplier}
                  style={styles.restockFromDropdown}
                  onSelect={item => store.setRestockFrom(+item.value)}
                />
                <View style={styles.infoIconContainer}>
                  <Tooltip message={restockFromTooltip} />
                </View>
              </View>
            )}
            <View style={styles.spaceBetweenContainer}>
              <Input
                keyboardType="number-pad"
                type={InputType.Primary}
                value={product?.upc}
                label="UPC Number"
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
  ),
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
  },
  orderSettingsContainer: {
    gap: 24,
    paddingHorizontal: 16,
  },
  orderSettingsLabel: {
    alignSelf: 'center',
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 16,
    lineHeight: 20,
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
