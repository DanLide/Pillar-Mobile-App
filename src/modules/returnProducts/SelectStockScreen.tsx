import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';

import { ReturnStackParamList, AppNavigator } from '../../navigation';

interface Props {
  navigation: NativeStackNavigationProp<
    ReturnStackParamList,
    AppNavigator.SelectStockScreen
  >;
}

export const SelectStockScreen: React.FC<Props> = ({ navigation }) => {
  return <SafeAreaView style={styles.container} />;
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
