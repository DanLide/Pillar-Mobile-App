import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  ActivityIndicator,
  ListRenderItem,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { observer } from 'mobx-react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { masterLockStore, ssoStore } from 'src/stores';
import permissionStore from 'src/modules/permissions/stores/PermissionStore';
import { useSingleToast } from 'src/hooks';
import { PERMISSIONS, RESULTS } from 'react-native-permissions';
import { ToastType } from 'src/contexts/types';
import { AppNavigator, RemoveStackParamList } from 'src/navigation/types';

import { StockModel, StockStore } from '../stores/StocksStore';
import { stocksStore } from '../stores';
import { fetchStocks } from '../../../data/fetchStocks';
import { StocksListItem } from './StocksListItem';
import { colors, SVGs } from '../../../theme';
import { Button, ButtonType } from '../../../components';
import { AuthError, BadRequestError } from '../../../data/helpers/tryFetch';

interface Props {
  onPressItem: (stock: StockModel) => void;
  skipNavToUnlockScreen?: boolean;
  itemRightText?: string;
  onFetchStocks?: (
    store: StockStore,
  ) => Promise<void | BadRequestError | AuthError>;
}

const keyExtractor = (item: StockModel) => String(item.partyRoleId);
const errorText =
  'Sorry, we are unable to connect to your stock location right now. To continue, you may need to locate a key to unlock the stock location.';

export const StocksList: React.FC<Props> = observer(
  ({ onPressItem, onFetchStocks, skipNavToUnlockScreen, itemRightText }) => {
    const route =
      useRoute<
        RouteProp<RemoveStackParamList, AppNavigator.SelectStockScreen>
      >();
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState(false);
    const isDeviceConfiguredBySSO = ssoStore.getIsDeviceConfiguredBySSO;

    const initMasterLock = useCallback(async () => {
      if (
        !stocksStore.stocks.length ||
        !permissionStore.isMasterLockPermissionsGranted
      )
        return;
      await masterLockStore.initMasterLockForStocks(stocksStore.stocks);
    }, [stocksStore.stocks, permissionStore.isMasterLockPermissionsGranted]);

    const handleFetchStocks = async () => {
      !isLoading && setIsLoading(true);
      const fetchStocksFunction = onFetchStocks ? onFetchStocks : fetchStocks;
      const error = await fetchStocksFunction(stocksStore);
      if (error) {
        !isError && setIsError(true);
      } else if (stocksStore.stocks.length) {
        await initMasterLock();
      }
      setIsLoading(false);
    };

    const renderStockListItem = useCallback<ListRenderItem<StockModel>>(
      ({ item }) => (
        <StocksListItem
          item={item}
          onPressItem={onPressItem}
          skipNavToUnlockScreen={skipNavToUnlockScreen}
          itemRightText={itemRightText}
        />
      ),
      [onPressItem, itemRightText, skipNavToUnlockScreen],
    );

    const handlePressRetry = () => {
      handleFetchStocks();
      setIsError(false);
    };

    const { showToast, hideAll, toastInitialized } = useSingleToast();

    const requestLocationPermission = useCallback(async () => {
      await permissionStore.requestPermission(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
    }, []);

    useEffect(() => {
      requestLocationPermission();
    }, [requestLocationPermission]);

    const checkPermissions = async () => {
      if (!isDeviceConfiguredBySSO) return;
      await permissionStore.setBluetoothPowerListener();
      permissionStore.locationCheck();

      let hideToasts = true;

      if (!toastInitialized) return;

      if (
        permissionStore.locationPermission !== RESULTS.GRANTED &&
        permissionStore.locationPermission !== RESULTS.DENIED
      ) {
        showToast('Location permissions not granted', {
          type: ToastType.LocationDisabled,
          onPress: () => {
            permissionStore.openSetting();
          },
        });
        hideToasts = false;
      }

      if (route.params?.succeedBluetooth && permissionStore.isBluetoothOn) {
        showToast('Bluetooth successfully connected', {
          type: ToastType.BluetoothEnabled,
        });
        navigation.setParams({
          ...route.params,
          succeedBluetooth: false,
        });
        return;
      }
      if (permissionStore.bluetoothPermission !== RESULTS.GRANTED) {
        showToast('Bluetooth not connected', {
          type: ToastType.BluetoothDisabled,
          onPress: () => {
            permissionStore.openSetting();
          },
        });
        return;
      }
      if (!permissionStore.isBluetoothOn) {
        showToast('Make sure Bluetooth is enabled, bluetooth not connected', {
          type: ToastType.BluetoothDisabled,
          onPress: () => {
            permissionStore.openBluetoothPowerSetting();
          },
          style: styles.toastStyle,
        });
        return;
      }
      hideToasts && hideAll();
    };

    useEffect(() => {
      checkPermissions();
    }, [
      permissionStore.isBluetoothOn,
      permissionStore.bluetoothPermission,
      permissionStore.locationPermission,
      showToast,
    ]);

    useEffect(() => {
      if (isFocused) {
        handleFetchStocks();
      }
    }, [isFocused]);

    if (isLoading) {
      return <ActivityIndicator size="large" />;
    }

    if (isError) {
      return (
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <SVGs.StockLocationErrorIcon />
            <Text style={styles.text}>{errorText}</Text>
          </View>
          <Button
            title="Retry"
            type={ButtonType.primary}
            buttonStyle={styles.buttonStyle}
            onPress={handlePressRetry}
          />
        </View>
      );
    }

    return (
      <FlatList
        data={stocksStore.stocks}
        renderItem={renderStockListItem}
        keyExtractor={keyExtractor}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    width: '100%',
    marginBottom: 16,
  },
  text: {
    marginTop: 24,
    marginHorizontal: 6,
    textAlign: 'center',
    color: colors.grayDark2,
  },
  toastStyle: {
    gap: 8,
  },
});
