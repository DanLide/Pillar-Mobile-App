import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { getFetchStockAPI } from 'src/data/api';
import { StocksList } from 'src/modules/stocksList/components/StocksList';
import { stocksStore } from 'src/modules/stocksList/stores';
import { StockModel } from 'src/modules/stocksList/stores/StocksStore';
import { colors, fonts, SVGs } from 'src/theme';
import { ordersStore } from '../stores';

type StockLocationListModalProps = {
  visible: boolean;
  closeModal: () => void;
}

export const StockLocationListModal: React.FC<StockLocationListModalProps> = ({ visible, closeModal }) => {
  const product = ordersStore.currentProduct;

  const fetchStocks = async () => {
    const allStocks = await getFetchStockAPI();
    const productCabinets = ordersStore.backorderCabinets;

    const availableStocks =
      allStocks.filter(stock =>
        productCabinets.find(
          cabinet => stock.partyRoleId === cabinet.storageAreaId,
        ),
      ) || [];

    stocksStore.setStocks(availableStocks);
  };

  const onItemPress = (stock: StockModel) => {
    ordersStore.setCurrentStocks(stock);
    closeModal();
  };

  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <Text style={styles.bannerText}>Choose Stock Location for Item</Text>
          <View style={styles.descriptionContainer}>
            <View style={styles.titleContainer}>
              <Pressable
                style={styles.iconWrapper}
                onPress={closeModal}
              >
                <SVGs.CloseIcon color={colors.purpleDark3} />
              </Pressable>
              <Text
                numberOfLines={1}
                style={styles.title}
              >
                {product?.name}
              </Text>
            </View>
            <Text style={styles.subTitle}>
              {product?.manufactureCode} {product?.partNo}
            </Text>
          </View>
          <StocksList
            onPressItem={onItemPress}
            onFetchStocks={fetchStocks}
            skipNavToUnlockScreen
            itemRightText='Receive here'
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    maxHeight: '50%',
    marginTop: 'auto',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    paddingBottom: 32,
  },
  bannerText: {
    textAlign: 'center',
    paddingVertical: 2,
    backgroundColor: colors.purpleLight,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: colors.grayWithOpacity,
  },
  descriptionContainer: {
    alignItems: 'center',
    paddingHorizontal: 13,
    marginTop: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginBottom: 11,
    width: '100%',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'absolute',
    left: 0,
  },
  title: {
    fontFamily: fonts.TT_Bold,
    fontSize: 15,
    lineHeight: 20,
  },
  subTitle: {
    color: colors.grayDark,
    fontFamily: fonts.TT_Regular,
    fontSize: 22,
    lineHeight: 26,
  },
})