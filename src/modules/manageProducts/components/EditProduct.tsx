import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
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
import { environment, getProductStepQty } from 'src/data/helpers';
import { manageProductsStore } from '../stores';
import { ProductModalProps } from 'src/modules/productModal';
import { TError } from 'src/modules/manageProducts/components/ProductModal';
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
  errors: TError;
  onRemoveBySelect?: (removeBy: number) => void;
  onMinimumChange?: (min: number) => void;
  onMaximumChange?: (max: number) => void;
  onUnitsPerContainerChange?: (unitsPerContainer: number) => void;
  onUpcChange?: (upc: string) => void;
  refPiecesPer: React.RefObject<TextInput>;
  refMin: React.RefObject<TextInput>;
  refMax: React.RefObject<TextInput>;
}

export const EditProduct = observer(
  ({
    product,
    stockName,
    errors,
    onRemoveBySelect,
    onMinimumChange,
    onMaximumChange,
    onUnitsPerContainerChange,
    onUpcChange,
    refPiecesPer,
    refMin,
    refMax,
  }: Props) => {
    const { t } = useTranslation();
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
        find(whereEq({ value: product?.replenishedFormId }), enabledSuppliers),
      [enabledSuppliers, product?.replenishedFormId],
    );

    const shipmentQuantityTooltip = useMemo(
      () => (
        <Text style={styles.tooltipMessage}>
          <Text style={[styles.tooltipMessage, styles.textBold]}>
            {t('shipmentQuantity')}
          </Text>{' '}
          - {t('incrementInWhichProductIsShipped')}
        </Text>
      ),
      [],
    );

    const restockFromTooltip = useMemo(
      () => (
        <Text style={styles.tooltipMessage}>
          <Text style={[styles.tooltipMessage, styles.textBold]}>
            {t('restockFrom')}
          </Text>{' '}
          - {t('chooseToReplenishFrom')}
        </Text>
      ),
      [t],
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
          label={t('removeBy')}
          disabled={isOnOrder}
          data={inventoryTypes}
          selectedItem={product?.inventoryUseTypeId}
          renderItem={renderInventoryType}
          style={styles.inventoryTypes}
          onSelect={onRemoveBySelect}
        />
        <Dropdown
          label={t('category')}
          data={categories}
          selectedItem={category}
          style={styles.categories}
          onSelect={item => store.setCategory(+item.value)}
        />
        <View style={styles.orderSection}>
          <View style={styles.orderSettingsContainer}>
            <Text style={styles.orderSettingsLabel}>{t('orderSettings')}</Text>
            <View style={styles.orderSettings}>
              {!isSpecialOrder && (
                <View style={styles.minMaxRow}>
                  <EditQuantity
                    vertical
                    label={t('minimum')}
                    currentValue={product?.min ?? 0}
                    maxValue={MAX_VALUE}
                    minValue={minQty}
                    stepValue={minQty}
                    initFontSize={28}
                    keyboardType={keyboardType}
                    error={errors.min}
                    onChange={onMinimumChange}
                    ref={refMin}
                  />
                  <Text style={styles.slash}>/</Text>
                  <EditQuantity
                    vertical
                    label={t('maximum')}
                    currentValue={product?.max ?? 0}
                    maxValue={MAX_VALUE}
                    minValue={minQty}
                    stepValue={minQty}
                    initFontSize={28}
                    keyboardType={keyboardType}
                    error={errors.max}
                    onChange={onMaximumChange}
                    ref={refMax}
                  />
                </View>
              )}
              <View style={styles.orderQuantities}>
                {isEachPeace && (
                  <EditQuantity
                    vertical
                    label={t('piecesPer')}
                    labelWithNewLine={t('container')}
                    disabled={isOnOrder}
                    hideCount={isOnOrder}
                    currentValue={product?.unitsPerContainer ?? 0}
                    maxValue={MAX_VALUE}
                    minValue={MIN_VALUE}
                    stepValue={STEP_VALUE}
                    initFontSize={28}
                    keyboardType="number-pad"
                    error={errors.unitsPerContainer}
                    ref={refPiecesPer}
                    onChange={onUnitsPerContainerChange}
                  />
                )}
                {!isSpecialOrder && (
                  <EditQuantity
                    vertical
                    label={t('shipment')}
                    labelWithNewLine={t('quantity')}
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
                  label={t('on')}
                  labelWithNewLine={t('order')}
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
          {!isSpecialOrder && (
            <Tooltip
              message={shipmentQuantityTooltip}
              contentStyle={styles.shipmentQuantity}
            >
              <Text style={styles.shipmentQuantityText}>
                {t('whatIsShipmentQuantity')}
              </Text>
            </Tooltip>
          )}
        </View>
        <View style={styles.bottomSection}>
          <Dropdown
            label={t('distributor')}
            disabled={isOnOrder}
            data={suppliers}
            selectedItem={supplier}
            onSelect={item => store.setSupplier(+item.value)}
          />
          {!isSpecialOrder && (
            <View style={styles.spaceBetweenContainer}>
              <Dropdown
                label={t('restockFrom')}
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
              label={t('upcNumber')}
              error={errors.upc}
              ref={inputRef}
              containerStyle={styles.upcInput}
              onChangeText={handleUpcChange}
            />
            <Button
              title={t('scan')}
              type={ButtonType.secondary}
              icon={SVGs.CodeIcon}
              iconProps={SCAN_ICON_PROPS}
              buttonStyle={styles.scanButton}
              textStyle={styles.scanButtonText}
              onPress={() => setIsUpcActive(true)}
            />
          </View>
          {environment.features.editProductROSwitch && (
            <Switch
              trackColor={{ true: colors.purple }}
              value={product?.isRecoverable}
              label={t('recommendedToAddToRO')}
              labelStyle={styles.recoverableLabel}
              style={styles.spaceBetweenContainer}
              onPress={() => store.toggleIsRecoverable()}
            />
          )}
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
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomColor: colors.neutral40,
    borderBottomWidth: 1,
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
