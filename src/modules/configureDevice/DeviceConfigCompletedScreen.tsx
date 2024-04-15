import { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import { SVGs, colors, fonts } from '../../theme';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { AppNavigator, ConfigureDeviceStackParams } from 'src/navigation/types';
import { StockModel } from '../stocksList/stores/StocksStore';
import { Button, ButtonType } from 'src/components';

type Props = NativeStackScreenProps<
  ConfigureDeviceStackParams,
  AppNavigator.DeviceConfigCompletedScreen
>;

export const DeviceConfigCompletedScreen = ({ route, navigation }: Props) => {
  const onNavigateToHome = () => {
    navigation.reset({
      routes: [{ name: AppNavigator.Drawer }],
    });
  };

  const ItemSeparator = () => <View style={styles.separator} />;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<StockModel>) => (
      <Text style={styles.item}>{item.organizationName}</Text>
    ),
    [],
  );
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <SVGs.CheckMark color={colors.green3} />
        <Text style={styles.title}>Shop Location Complete</Text>
      </View>
      <Text style={styles.subtitle}>
        You have successfully add Shop Location with the following Stock
        Location(s)
      </Text>

      <View style={styles.table}>
        <Text style={styles.tableTitle}>Stock Location</Text>
        <FlatList
          data={route.params.stocks}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          type={ButtonType.primary}
          buttonStyle={styles.button}
          title="Home"
          onPress={onNavigateToHome}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 12,
  },
  title: {
    fontSize: 15,
    lineHeight: 18.5,
    fontFamily: fonts.TT_Bold,
    paddingLeft: 8,
  },
  subtitle: {
    paddingHorizontal: 44,
    fontSize: 11,
    lineHeight: 13.5,
    fontFamily: fonts.TT_Regular,
    textAlign: 'center',
    paddingVertical: 8,
  },
  table: {
    backgroundColor: colors.white,
    flex: 1,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral30,
  },
  tableTitle: {
    paddingVertical: 8,
    paddingLeft: 16,
    fontFamily: fonts.TT_Bold,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textNeutral,
    borderBottomColor: colors.neutral30,
    borderBottomWidth: 1,
    backgroundColor: colors.grayLight,
  },
  separator: {
    width: '95%',
    marginLeft: '5%',
    height: 1,
    backgroundColor: colors.gray,
  },
  button: {
    backgroundColor: colors.purple,
    marginHorizontal: 16,
  },
  buttonContainer: {
    padding: 12,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark3,
  },
});
