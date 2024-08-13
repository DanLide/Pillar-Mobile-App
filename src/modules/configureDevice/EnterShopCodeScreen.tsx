import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';
import { ToastType } from 'src/contexts/types';
import { useSingleToast } from 'src/hooks';
import { AppNavigator, ConfigureDeviceStackParams } from 'src/navigation/types';
import { TextButton } from '../../components';
import SecretCodeForm from '../../components/SecretCodeForm';
import { colors, fonts } from '../../theme';

import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { fetchStocksByShopSetupCodeTask } from 'src/data/fetchStocksByShopSetupCode';
import { Utils } from 'src/data/helpers/utils';
import { stocksStore } from 'src/modules/stocksList/stores';
import { ssoStore } from 'src/stores';

interface Props {
  navigation: NativeStackNavigationProp<
    ConfigureDeviceStackParams,
    AppNavigator.EnterShopCodeScreen
  >;
}

const { width, height } = Dimensions.get('window');

const EnterShopCodeScreenBody = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const stocksStoreRef = useRef(stocksStore).current;
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useSingleToast();

  const onPressScanShopCode = () => {
    navigation.goBack();
  };

  const onError = (errorMessage: string) => {
    setIsLoading(false);

    showToast(errorMessage, {
      type: ToastType.ScanError,
      duration: 0,
    });
  };

  const handleSubmitForm = async (shopSetupCode: string) => {
    setIsLoading(true);
    const error = await fetchStocksByShopSetupCodeTask(
      shopSetupCode,
      ssoStore,
      stocksStore,
    );

    if (error) {
      return onError?.(
        Utils.isNetworkError(error)
          ? t('checkYourInternetConnection')
          : t('invalidFacilityCode'),
      );
    }
    setIsLoading(false);

    if (stocksStoreRef.getMasterlockStocks.length) {
      navigation.navigate(AppNavigator.SelectStockLocationsScreen);
    } else {
      navigation.reset({
        routes: [{ name: AppNavigator.Drawer }],
      });
    }
  };

  return (
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
      <Text style={styles.formDescription}>
        {t('thisWillBeInYourActivationEmail')}
      </Text>
      <View>
        <SecretCodeForm handleConfirm={handleSubmitForm} cellCount={5} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.text}>{t('facilityCodeNotWorking')}</Text>
        <TextButton
          title={t('scanYourQRCodeInstead')}
          onPress={onPressScanShopCode}
          style={styles.shopCodeButton}
        />
      </View>
    </View>
  );
};

const EnterShopCodeScreen = ({ navigation }: Props) => {
  return (
    <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
      <EnterShopCodeScreenBody navigation={navigation} />
    </ToastContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  formDescription: {
    textAlign: 'center',
    paddingTop: 107,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
  },
  footer: {
    justifyContent: 'flex-end',
    flexGrow: 1,
    height: 100,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
  },
  shopCodeButton: {
    paddingVertical: 12,
    marginBottom: 5,
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

export default EnterShopCodeScreen;
