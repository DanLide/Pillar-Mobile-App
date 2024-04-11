import { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { SVGs, colors } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { AppNavigator, TManageProductsNavScreenProps } from '../types';

export const ScannerHeaderRightButtons = memo(() => {
  const navigation =
    useNavigation<
      TManageProductsNavScreenProps<AppNavigator.ScannerScreen>['navigation']
    >();

  const goToHomeScreen = () => navigation.navigate(AppNavigator.HomeScreen);
  const goToHowToScan = () => navigation.navigate(AppNavigator.HowToScanScreen);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToHomeScreen} style={styles.iconContainer}>
        <SVGs.HomeIcon color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToHowToScan} style={styles.iconContainer}>
        <SVGs.QuestionIcon color={colors.white} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  iconContainer: {
    height: 45,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
