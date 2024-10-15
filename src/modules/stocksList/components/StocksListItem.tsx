import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { masterLockStore, southcoStore, ssoStore } from 'src/stores';
import { useTranslation } from 'react-i18next';

import { StockModel } from '../stores/StocksStore';
import { RoleType } from 'src/constants/common.enum';
import { colors, fonts, SVGs } from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { AppNavigator, RemoveStackParamList } from 'src/navigation/types';
import { LockStatus, LockVisibility } from 'src/data/masterlock';
import { observer } from 'mobx-react';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';
import { SCLockStatusEnum } from 'src/libs';

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

export const STOCK_ITEM_HEIGHT = 56;

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
    const { t } = useTranslation();
    const {
      organizationName,
      roleTypeId,
      controllerSerialNo = '',
      leanTecSerialNo = '',
    } = item;

    const SCLockId = leanTecSerialNo?.toLowerCase();

    const currentSCLock = southcoStore.locks.get(SCLockId);
    const isDeviceConfiguredBySSO = ssoStore.getIsDeviceConfiguredBySSO;
    const navigation = useNavigation<ScreenNavigationProp>();
    const MLStatus = masterLockStore.stocksState[controllerSerialNo]?.status;

    const isVisible =
      masterLockStore.stocksState[controllerSerialNo]?.visibility ===
        LockVisibility.VISIBLE || currentSCLock;
    const SCStatus = currentSCLock?.status;

    const isMLLocked =
      roleTypeId === RoleType.Cabinet &&
      (MLStatus === LockStatus.LOCKED || MLStatus === LockStatus.OPEN_LOCKED) &&
      isVisible;

    const isSCLocked =
      roleTypeId === RoleType.Cabinet && SCStatus === SCLockStatusEnum.LOCKED;

    const isLocked = isSCLocked || isMLLocked;

    const isSCUnlockingDisabled =
      currentSCLock &&
      !!southcoStore.openedLockId &&
      (southcoStore.openedLockId !== currentSCLock?.id ||
        southcoStore.isUnlocking);

    const handlePress = () => {
      if (isLocked && !skipNavToUnlockScreen) {
        if (currentSCLock && isLocked) {
          southcoStore.startUnlockProcess(currentSCLock.id);
          navigation.navigate(AppNavigator.BaseUnlockScreen, {
            title: organizationName,
            SCId: SCLockId,
            nextNavigationGoBack,
          });
        } else if (item.controllerSerialNo && isDeviceConfiguredBySSO) {
          masterLockStore.unlock(item.controllerSerialNo);
          navigation.navigate(AppNavigator.BaseUnlockScreen, {
            title: organizationName,
            MLId: item.controllerSerialNo,
            nextNavigationGoBack,
          });
        }
        onPressItem && onPressItem(item, true);
      } else {
        onPressItem && onPressItem(item);
      }
    };

    const renderIcon = () => {
      if (
        (roleTypeId !== RoleType.Cabinet && isVisible) ||
        !isDeviceConfiguredBySSO
      ) {
        return <SVGs.CabinetSimple />;
      }

      if (SCStatus) {
        switch (SCStatus) {
          case SCLockStatusEnum.UNLOCKED:
            return <SVGs.CabinetOpen />;
          case SCLockStatusEnum.LOCKED:
            return <SVGs.CabinetLocked />;
          case SCLockStatusEnum.UNKNOWN:
            return <SVGs.CabinetError />;
          case SCLockStatusEnum.OPEN_LOCKED:
            return <SVGs.CabinetOpenLocked />;
          default:
            return <SVGs.CabinetSimple />;
        }
      }
      if (MLStatus) {
        switch (MLStatus) {
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
      }
      return <SVGs.CabinetSimple />;
    };

    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={handlePress}
        disabled={!onPressItem || isSCUnlockingDisabled}
      >
        <View style={[styles.underlineContainer, subContainer]}>
          <View style={styles.rowContainer}>
            {renderIcon()}
            <Text style={styles.title}>{organizationName}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {itemRightText ||
                (isDeviceConfiguredBySSO && isLocked && t('unlock'))}
            </Text>
            <SVGs.ChevronIcon color={colors.purpleDark} />
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: STOCK_ITEM_HEIGHT,
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
    fontSize: 17,
    lineHeight: 22,
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
