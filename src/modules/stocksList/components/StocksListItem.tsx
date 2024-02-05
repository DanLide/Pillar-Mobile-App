import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import { masterLockStore, ssoStore } from 'src/stores';

import { StockModel } from '../stores/StocksStore';
import { RoleType } from 'src/constants/common.enum';
import { colors, fonts, SVGs } from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { AppNavigator, RemoveStackParamList } from 'src/navigation/types';
import { LockStatus, LockVisibility } from 'src/data/masterlock';
import { observer } from 'mobx-react';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';

type ScreenNavigationProp = NativeStackNavigationProp<
  RemoveStackParamList,
  AppNavigator.SelectStockScreen
>;

interface Props {
  item: StockModel;
  onPressItem?: (stock: StockModel, withoutNavigation?: boolean) => void;
  containerStyle?: ViewStyle;
  subContainer?: ViewStyle;
  skipNavToUnlockScreen?: boolean;
  itemRightText?: string;
  nextNavigationGoBack?: boolean;
}

const UNLOCK_BUTTON_HIT_SLOP = { right: 24 };

export const StocksListItem: React.FC<Props> = observer(
  ({
    item,
    onPressItem,
    containerStyle,
    subContainer,
    skipNavToUnlockScreen,
    itemRightText,
    nextNavigationGoBack,
  }) => {
    const { organizationName, roleTypeId, controllerSerialNo = '' } = item;

    const isDeviceConfiguredBySSO = ssoStore.getIsDeviceConfiguredBySSO;
    const navigation = useNavigation<ScreenNavigationProp>();
    const lockStatus = masterLockStore.stocksState[controllerSerialNo]?.status;
    const isVisible =
      masterLockStore.stocksState[controllerSerialNo]?.visibility ===
      LockVisibility.VISIBLE;

    const isLocked =
      roleTypeId === RoleType.Cabinet &&
      lockStatus === LockStatus.LOCKED &&
      isVisible;

    const unlockMasterlock = () => {
      if (
        isLocked &&
        !skipNavToUnlockScreen &&
        item.controllerSerialNo &&
        isDeviceConfiguredBySSO
      ) {
        masterLockStore.unlock(item.controllerSerialNo);
        onPressItem && onPressItem(item, true);
        return navigation.navigate(AppNavigator.BaseUnlockScreen, {
          title: organizationName,
          masterlockId: item.controllerSerialNo,
          nextNavigationGoBack,
        });
      }
    };

    const handlePress = () => {
      onPressItem && onPressItem(item);
    };

    const renderIcon = () => {
      if (
        (roleTypeId !== RoleType.Cabinet && isVisible) ||
        !isDeviceConfiguredBySSO
      ) {
        return <SVGs.CabinetSimple />;
      }
      switch (lockStatus) {
        case LockStatus.UNLOCKED:
        case LockStatus.OPEN:
          return <SVGs.CabinetOpen />;
        case LockStatus.LOCKED:
        case LockStatus.PENDING_UNLOCK:
        case LockStatus.PENDING_RELOCK:
          return <SVGs.CabinetLocked />;
        case LockStatus.OPEN_LOCKED:
          return <SVGs.CabinetOpenLocked />;
        case LockStatus.UNKNOWN:
          return <SVGs.CabinetError />;
        default:
          return <SVGs.CabinetSimple />;
      }
    };

    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={handlePress}
        disabled={!onPressItem}
      >
        <View style={[styles.underlineContainer, subContainer]}>
          <View style={styles.rowContainer}>
            {renderIcon()}
            <Text style={styles.title}>{organizationName}</Text>
          </View>
          {itemRightText ? (
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{itemRightText}</Text>
              <SVGs.ChevronIcon color={colors.purpleDark} />
            </View>
          ) : (
            <Pressable
              hitSlop={UNLOCK_BUTTON_HIT_SLOP}
              onPress={unlockMasterlock}
              style={styles.statusContainer}
            >
              {isDeviceConfiguredBySSO && isLocked && (
                <Text style={styles.statusText}>Unlock</Text>
              )}
              <SVGs.ChevronIcon color={colors.purpleDark} />
            </Pressable>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 65.5,
    paddingLeft: 16,
    backgroundColor: colors.white,
    paddingRight: 22,
  },
  underlineContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  title: {
    paddingLeft: 15,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: fonts.TT_Regular,
    color: '#323234',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    height: '100%',
  },
  statusText: {
    paddingRight: 16,
    color: colors.purpleDark,
    fontSize: 18,
    lineHeight: 23.5,
    fontFamily: fonts.TT_Regular,
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
});
