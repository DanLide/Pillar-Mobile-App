import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ListRenderItemInfo,
  Pressable,
} from 'react-native';
import {
  Button,
  ButtonType,
  Checkbox,
  InfoTitleBar,
  InfoTitleBarType,
  Text,
} from '../../components';
import { colors, fonts } from '../../theme';
import { stocksStore } from '../stocksList/stores';
import { StockModel } from '../stocksList/stores/StocksStore';
import { resetMasterlock } from 'src/data/resetMasterlock';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';
import { AppNavigator, ConfigureDeviceStackParams } from 'src/navigation/types';
import { ssoStore } from 'src/stores';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { useSingleToast } from 'src/hooks';
import { ToastType } from 'src/contexts/types';

interface Props {
  navigation: NativeStackNavigationProp<
    ConfigureDeviceStackParams,
    AppNavigator.SelectStockLocationsScreen
  >;
}

const selectAllItem = 'All Cabinets';

const SelectStockLocations = observer(({ navigation }: Props) => {
  const ssoStoreRef = useRef(ssoStore).current;
  const stocksStoreRef = useRef(stocksStore).current;
  const listData = [selectAllItem, ...stocksStoreRef.getMasterlockStocks];
  const [selectedStocks, setSelectedStocks] = useState<StockModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useSingleToast();

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    const error = await resetMasterlock(selectedStocks);
    setIsLoading(false);

    if (error) {
      showToast(error.message ?? 'Request failed!', {
        type: ToastType.Error,
      });
    } else {
      stocksStore.clear();
      navigation.navigate(AppNavigator.DeviceConfigCompletedScreen, {
        stocks: selectedStocks,
      });
    }
  }, [navigation, selectedStocks, showToast]);

  const onSelectStock = (currentStock: StockModel | string) => {
    const isItemString = typeof currentStock === 'string';
    if (isItemString) {
      if (selectedStocks.length === stocksStoreRef.getMasterlockStocks.length) {
        setSelectedStocks([]);
      } else {
        setSelectedStocks(stocksStoreRef.getMasterlockStocks);
      }
    } else if (
      selectedStocks.find(
        stock => stock.organizationName === currentStock.organizationName,
      )
    ) {
      const stocks = selectedStocks.filter(
        stock => stock.organizationName !== currentStock.organizationName,
      );
      setSelectedStocks(stocks);
    } else {
      setSelectedStocks([...selectedStocks, currentStock]);
    }
  };

  const renderStockItem = ({
    item,
  }: ListRenderItemInfo<StockModel | string>) => {
    const isItemString = typeof item === 'string';
    const title = isItemString ? item : item.organizationName;

    const isSelectedItem = isItemString
      ? selectedStocks.length === stocksStoreRef.getMasterlockStocks.length
      : selectedStocks.find(
          stock => stock.organizationName === item.organizationName,
        );

    return (
      <Pressable
        style={[
          styles.itemContainer,
          isSelectedItem ? styles.selectedItem : null,
        ]}
        onPress={() => onSelectStock(item)}
      >
        <Checkbox
          disabled
          isChecked={!!isSelectedItem}
          onChange={() => onSelectStock(item)}
          style={styles.checkbox}
        />
        <Text style={styles.itemText}>{title}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <InfoTitleBar
        title={ssoStoreRef.getCurrentSSO?.name}
        type={InfoTitleBarType.Primary}
      />
      <InfoTitleBar
        title="Select Stock Location(s) for this device"
        type={InfoTitleBarType.Secondary}
      />
      <FlatList
        data={listData}
        renderItem={renderStockItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.buttonContainer}>
        <Button
          type={ButtonType.primary}
          buttonStyle={styles.button}
          disabled={!selectedStocks.length}
          title="Confirm"
          isLoading={isLoading}
          onPress={handleConfirm}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.purple,
    marginHorizontal: 16,
  },
  itemContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontFamily: fonts.TT_Bold,
    paddingLeft: 12,
  },
  separator: {
    height: 1,
    width: '100%',
    marginLeft: 'auto',
    backgroundColor: colors.neutral30,
  },
  checkbox: {
    borderRadius: 6,
  },
  selectedItem: {
    backgroundColor: colors.purpleLight,
  },
  buttonContainer: {
    padding: 12,
  },
});

export const SelectStockLocationsScreen = ({ navigation }: Props) => {
  return (
    <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
      <SelectStockLocations navigation={navigation} />
    </ToastContextProvider>
  );
};
