import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';
import { ToastType } from 'src/contexts/types';
import { useSingleToast } from 'src/hooks';
import { AppNavigator, ConfigureDeviceStackParams } from 'src/navigation/types';
import { Button, ButtonType } from '../../components';
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

const errorMessages = {
  incorrectCode:
    'Invalid Code, make sure the code is for the correct repair facility.',
  networkRequestFailed: 'Please check your internet connection and retry',
};

const { width, height } = Dimensions.get('window');

const EnterShopCodeScreenBody = ({ navigation }: Props) => {
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
          ? errorMessages.networkRequestFailed
          : errorMessages.incorrectCode,
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
        <Text style={styles.formDescription}>
          This will be in your activation email.
        </Text>
        <View>
          <SecretCodeForm handleConfirm={handleSubmitForm} cellCount={5} />
        </View>
        <View style={styles.footer}>
          <Text style={styles.text}>Repair Facility code not working?</Text>
          <Button
            type={ButtonType.primary}
            buttonStyle={styles.shopCodeButton}
            textStyle={styles.shopCodeButtonText}
            title="Scan your QR code instead"
            onPress={onPressScanShopCode}
          />
        </View>
      </View>
    </ToastContextProvider>
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
    width: '100%',
    backgroundColor: 'transparent',
    marginBottom: 5,
  },
  shopCodeButtonText: {
    paddingLeft: 8,
    fontSize: 13,
    fontFamily: fonts.TT_Bold,
    lineHeight: 18,
    color: colors.purpleDark,
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
