import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import masterLockStore from '../../../stores/MasterLockStore';

import { StockModel } from '../stores/StocksStore';
import { RoleType } from '../../../constants/common.enum';
import { colors, fonts, SVGs } from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { AppNavigator } from '../../../navigation/types';
import { LockStatus, LockVisibility } from '../../../data/masterlock';
import { observer } from 'mobx-react';

interface Props {
  item: StockModel;
  onPressItem: (stock: StockModel) => void;
}

export const StocksListItem: React.FC<Props> = observer(({ item, onPressItem }) => {
  const { organizationName, roleTypeId, controllerSerialNo = '' } = item;

  const navigation = useNavigation();
  const lockStatus = masterLockStore.stocksState[controllerSerialNo]?.status;
  const isVisible = masterLockStore.stocksState[controllerSerialNo]?.visibility === LockVisibility.VISIBLE;

  const isLocked = roleTypeId === RoleType.Cabinet &&
    lockStatus === LockStatus.LOCKED &&
    isVisible
    ;

  const handlePress = () => {
    if (isLocked) {
      masterLockStore.unlock(controllerSerialNo)
      return navigation.navigate(AppNavigator.BaseUnlockScreen, { title: organizationName, masterlockId: controllerSerialNo})
    }
    onPressItem(item)
  };

  const renderIcon = () => {
    if (roleTypeId !== RoleType.Cabinet && isVisible) {
      return <SVGs.CabinetSimple />
    }
    switch (lockStatus) {
      case LockStatus.UNLOCKED:
      case LockStatus.OPEN:
        return (<SVGs.CabinetOpen />)
      case LockStatus.LOCKED:
      case LockStatus.PENDING_UNLOCK:
      case LockStatus.PENDING_RELOCK:
        return (<SVGs.CabinetLocked />)
      case LockStatus.OPEN_LOCKED:
        return (<SVGs.CabinetOpenLocked />)
      case LockStatus.UNKNOWN:
        return (<SVGs.CabinetError />)
      default: return <SVGs.CabinetSimple />
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.underlineContainer}>
        <View style={styles.rowContainer}>
          {renderIcon()}
          <Text style={styles.title}>{organizationName}</Text>
        </View>
        <View style={styles.statusContainer}>
          {isLocked && <Text style={styles.statusText}>Unlock</Text>}
          <SVGs.ChevronIcon color={colors.purpleDark} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 65.5,
    paddingLeft: 16,
    backgroundColor: colors.white,
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
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 22,
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
  }
});
