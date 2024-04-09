import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { SVGs, colors } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { AppNavigator, TManageProductsNavScreenProps } from '../types'

export const ScannerHeaderRightButtons = () => {
  const navigation =
    useNavigation<
      TManageProductsNavScreenProps<AppNavigator.ScannerScreen>['navigation']
    >();
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate(AppNavigator.HomeScreen)}
        style={styles.iconContainer}
      >
        <SVGs.HomeIcon color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(AppNavigator.HowToScanScreen)}
        style={styles.iconContainer}
      >
        <SVGs.QuestionIcon color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    height: 45,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
