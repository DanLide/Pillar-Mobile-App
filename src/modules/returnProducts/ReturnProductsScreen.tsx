import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';

import {
  CurrentProductStoreType,
  ScannerModalStoreType,
  StockProductStoreType,
} from '../../stores/types';
import {
  Button,
  ButtonType,
  InfoTitleBar,
  InfoTitleBarType,
  TooltipBar,
} from '../../components';
import { AppNavigator, ReturnStackParamList } from '../../navigation/types';
import { returnProductsStore } from './stores';
import { colors, SVGs } from '../../theme';
import { SelectedProductsList } from './components';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

interface Props {
  navigation: NativeStackNavigationProp<
    ReturnStackParamList,
    AppNavigator.ReturnProductsScreen
  >;
}

type Store = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const ScanIcon = (
  <SVGs.CodeIcon color={colors.purple} width={32} height={23.33} />
);

export const ReturnProductsScreen: React.FC<Props> = ({ navigation }) => {
  const store = useRef<Store>(returnProductsStore).current;

  const onPressScan = async () => {
    const result = await check(PERMISSIONS.IOS.CAMERA);

    if (result !== RESULTS.GRANTED) {
      return navigation.navigate(AppNavigator.CameraPermissionScreen, {
        nextRoute: AppNavigator.ReturnProductScannerScreen,
      });
    }

    navigation.navigate(AppNavigator.ReturnProductScannerScreen);
  };

  return (
    <View style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Primary}
        title={store.currentStock?.organizationName}
      />
      <TooltipBar title="Scan to add products to list" />

      <SelectedProductsList />

      <View style={styles.buttons}>
        <Button
          type={ButtonType.secondary}
          icon={ScanIcon}
          textStyle={styles.scanText}
          buttonStyle={styles.buttonContainer}
          title="Scan"
          onPress={onPressScan}
        />

        <Button
          type={ButtonType.primary}
          disabled={!store.getProducts.length}
          buttonStyle={styles.buttonContainer}
          title="Complete"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
  },
  scanText: {
    paddingLeft: 8,
  },
  buttonContainer: {
    width: 163.5,
    height: 48,
  },
});
