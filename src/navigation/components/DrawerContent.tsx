import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { getVersion } from 'react-native-device-info';

import { authStore, ssoStore } from '../../stores';
import { colors, fonts, SVGs } from '../../theme';
import Logo from '../../../assets/images/Logo.png';
import { DrawerListItem } from './DrawerListItem';
import { DrawerListButton } from './DrawerListButton';

export const DrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const version = `Version ${getVersion()}`;
  const onLogout = () => {
    authStore.logOut();
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <View style={styles.topContainer}>
        <Image
          source={Logo}
          style={styles.image}
          resizeMode='contain'
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={navigation.closeDrawer}
        >
          <SVGs.CloseIcon color={colors.black} />
        </TouchableOpacity>
      </View>

      <DrawerListItem
        title={authStore.getName || ""}
        subtitle={authStore?.userRole}
        icon={<SVGs.ProfileIcon />}
      />
      <DrawerListItem
        title={ssoStore.getCurrentSSO?.name || ""}
        subtitle={ssoStore.getCurrentSSO?.address}
        icon={<SVGs.CabinetIcon />}
      />
      <DrawerListItem
        title={"Settings"}
        icon={<SVGs.SettingsIcon />}
        showChevron
      />

      <View style={styles.bottomContainer}>
        <DrawerListButton
          onPress={onLogout}
          icon={<SVGs.LogoutIcon2 color={colors.blue} />}
          title="Logout"
          disabled={false}
        />
        <DrawerListButton
          icon={<SVGs.SupportIcon color={colors.blue} />}
          title="Support"
        />
        <Text style={styles.subtitleText}>
          {version}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  iconButton: {
    padding: 14,
  },
  closeButton: {
    top: 2,
    right: 8,
  },
  topContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  image: {
    width: '85%',
    height: undefined,
    aspectRatio: 4,
    marginLeft: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  listContainer: {
    paddingLeft: 18,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  infoText: {
    fontSize: 15,
    fontFamily: fonts.TT_Regular,
    color: colors.blackSemiLight,
    fontWeight: "700",
  },
  subtitleText: {
    marginTop: 6,
    color: colors.blackLight
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray,
  },
  bottomContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 16,
  },
  button: {
    flexDirection: 'row',
    marginHorizontal: 13,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderColor: colors.grayDark,
    marginBottom: 10,
  },
  iconWrapper: {
    paddingVertical: 13,
  },
});