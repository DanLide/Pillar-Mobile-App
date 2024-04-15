import { useMemo, useRef } from 'react';
import {
  Text,
  View,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
} from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { isNil } from 'ramda';

import { ordersStore } from '../stores';
import { Modal, Button, ButtonType } from '../../../components';
import { SVGs, colors, fonts } from '../../../theme';
import { ProductModel } from '../../../stores/types';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const MissingItemsModal: React.FC<Props> = ({
  isVisible,
  onClose,
  onSubmit,
}) => {
  const ordersStoreRef = useRef(ordersStore).current;

  const renderItem = ({
    item,
  }: ListRenderItemInfo<NonNullable<ProductModel>>) => {
    if (isNil(item.orderedQty) || isNil(item.reservedCount)) return null;

    if (item.orderedQty - item.reservedCount === 0) return null;

    return (
      <View style={styles.item}>
        <View style={styles.description}>
          <Text style={styles.itemName}> {item.name}</Text>
          <Text style={styles.itemSize}> {item.size}</Text>
        </View>
        <View>
          <Text style={styles.itemName}>
            {item.orderedQty - item.reservedCount}
          </Text>
        </View>
      </View>
    );
  };

  const topOffset = useMemo<SharedValue<number>>(() => ({ value: 120 }), []);

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      topOffset={topOffset}
      contentContainerStyle={styles.modal}
    >
      <View style={styles.titleContainer}>
        <SVGs.Warning color={colors.black} />
        <Text style={styles.title}>Items Missing</Text>
      </View>

      <Text style={styles.subtitle}>
        These items are missing from this order and will not be received
      </Text>
      <View style={styles.table}>
        <View style={styles.header}>
          <Text style={[styles.headerText, styles.headerLeft]}>Product</Text>
          <Text style={[styles.headerRight, styles.headerText]}>Missing</Text>
        </View>
        <FlatList
          style={styles.flatList}
          data={ordersStoreRef.currentOrder?.productList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      <Button
        type={ButtonType.primary}
        title="I still want these items"
        buttonStyle={styles.button}
        onPress={onSubmit}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: 400,
    margin: 16,
    marginBottom: 100,
    borderRadius: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
    paddingLeft: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
    textAlign: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.neutral30,
    borderRadius: 8,
    margin: 8,
  },
  flatList: {
    height: 180,
    borderBottomEndRadius: 8,
    borderBottomLeftRadius: 8,
  },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    backgroundColor: colors.grayLight,
    borderBottomColor: colors.neutral30,
    borderBottomWidth: 1,
    borderTopEndRadius: 8,
    borderTopLeftRadius: 8,
  },
  headerText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    color: colors.blackSemiLight,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: '20%',
    textAlign: 'right',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  description: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
  },
  itemSize: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark,
  },
  separator: {
    height: 1,
    width: '95%',
    marginLeft: 'auto',
    backgroundColor: colors.neutral30,
  },
  itemReceiving: {
    width: '20%',
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark3,
    textAlign: 'center',
  },
  button: { margin: 16, marginTop: 24 },
});
