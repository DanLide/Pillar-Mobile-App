import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';

import { Button, ButtonType } from '../../components';

import { ToastType } from 'src/contexts/types';

import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';
import ScanProduct, { ScanProductProps } from 'src/components/ScanProduct';
import { useSingleToast } from 'src/hooks';
import {
  AppNavigator,
  ConfigureDeviceStackParams,
} from '../../navigation/types';
import { colors, fonts } from '../../theme';

import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { fetchStocksByShopSetupCodeTask } from 'src/data/fetchStocksByShopSetupCode';
import { Utils } from 'src/data/helpers/utils';
import { stocksStore } from 'src/modules/stocksList/stores';
import { ssoStore } from 'src/stores';

export enum ScannerScreenError {
  IncorrectQRCode,
  NetworkRequestFailed,
}

export const scannerErrorMessages: Record<ScannerScreenError, string> = {
  [ScannerScreenError.IncorrectQRCode]:
    'Invalid Code, make sure the QR code is for the correct repair facility.',
  [ScannerScreenError.NetworkRequestFailed]:
    'Please check your internet connection and retry',
};

interface Props {
  navigation: NativeStackNavigationProp<
    ConfigureDeviceStackParams,
    AppNavigator.ScanShopCodeScreen
  >;
}

const { width, height } = Dimensions.get('window');

const ScanShopCodeScreenBody = observer(({ navigation }: Props) => {
  const stocksStoreRef = useRef(stocksStore).current;
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useSingleToast();

  const checkPermission = useCallback(async () => {
    setIsLoading(true);
    const result = await request(PERMISSIONS.IOS.CAMERA);
    setIsLoading(false);

    if (result !== RESULTS.GRANTED) {
      navigation.navigate(AppNavigator.CameraPermissionScreen, {
        nextRoute: AppNavigator.ScanShopCodeScreen,
      });
    }
  }, [navigation]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const onScanError = useCallback(
    (error: ScannerScreenError) => {
      setIsLoading(false);
      setIsScannerActive(true);

      showToast(scannerErrorMessages[error], {
        type: ToastType.ScanError,
        duration: 0,
      });
    },
    [showToast],
  );

  const fetchSSOById = useCallback(
    async (shopSetupCode: string) => {
      setIsLoading(true);
      const error = await fetchStocksByShopSetupCodeTask(
        shopSetupCode,
        ssoStore,
        stocksStore,
      );

      if (error) {
        return onScanError?.(
          Utils.isNetworkError(error)
            ? ScannerScreenError.NetworkRequestFailed
            : ScannerScreenError.IncorrectQRCode,
        );
      }

      setIsLoading(false);
      setIsScannerActive(true);

      if (stocksStoreRef.getMasterlockStocks.length) {
        navigation.navigate(AppNavigator.SelectStockLocationsScreen);
      } else {
        navigation.reset({
          routes: [{ name: AppNavigator.Drawer }],
        });
      }
    },
    [navigation, onScanError, stocksStoreRef.getMasterlockStocks],
  );

  const onScanShopCode = useCallback<ScanProductProps['onScan']>(
    async code => {
      setIsScannerActive(false);

      if (typeof code === 'string') {
        await fetchSSOById(code);
      } else {
        onScanError?.(ScannerScreenError.IncorrectQRCode);
      }
    },
    [fetchSSOById, onScanError],
  );

  const onPressEnterShopCode = () => {
    navigation.navigate(AppNavigator.EnterShopCodeScreen);
  };

  return (
    <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator
              size="large"
              color="white"
              style={styles.activityIndicator}
            />
          </View>
        ) : null}
        <ScanProduct
          onScan={onScanShopCode}
          isActive={isScannerActive}
          tooltipText={'Looking for code'}
        />
        <View style={styles.footer}>
          <Text style={styles.text}>QR Code not working?</Text>
          <Button
            type={ButtonType.primary}
            buttonStyle={styles.shopCodeButton}
            textStyle={styles.shopCodeButtonText}
            title="Enter 5 character Repair Facility code instead"
            onPress={onPressEnterShopCode}
          />
        </View>
      </View>
    </ToastContextProvider>
  );
});

export const ScanShopCodeScreen = observer(({ navigation }: Props) => {
  return (
    <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
      <ScanShopCodeScreenBody navigation={navigation} />
    </ToastContextProvider>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  footer: {
    justifyContent: 'flex-end',
    height: 100,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  shopCodeButtonText: {
    paddingLeft: 8,
    fontSize: 13,
    fontFamily: fonts.TT_Bold,
    lineHeight: 18,
    color: colors.purpleDark,
  },
  shopCodeButton: {
    width: '100%',
    backgroundColor: 'transparent',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
  },
  loader: {
    position: 'absolute',
    width,
    height,
    backgroundColor: colors.gray,
    top: 0,
    zIndex: 100,
    opacity: 0.6,
  },
  activityIndicator: {
    marginTop: height / 2 - 150,
  },
});