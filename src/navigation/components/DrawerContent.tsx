import { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DrawerContentComponentProps,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';

import { authStore, ssoStore, deviceInfoStore } from '../../stores';
import { colors, fonts, SVGs } from '../../theme';
import Logo from '../../../assets/images/logoPerformanceSolution.png';
import { DrawerListItem } from './DrawerListItem';
import { DrawerListButton } from './DrawerListButton';
import { AppNavigator } from '../types';
import SupportAlertWrapper from 'src/navigation/components/DrawerAlertWrappers/SupportAlertWrapper';
import { FocusAwareStatusBar } from 'src/components';

export const DrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation,
}) => {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { t } = useTranslation();
  const [isSupportAlertVisible, setIsSupportAlertVisible] =
    useState<boolean>(false);

  const isNavigationToShopSelectAvailable =
    (ssoStore.getSSOList?.length || 0) > 1 &&
    !ssoStore.getIsDeviceConfiguredBySSO;
  const version = `${t('version')} ${deviceInfoStore.version}`;
  const onLogout = () => {
    authStore.logOut();
  };

  const handleSupportButtonPress = () => {
    setIsSupportAlertVisible(true);
  };

  const handleSupportAlertPrimaryPress = () => {
    setIsSupportAlertVisible(false);
  };

  const onNavigateToSelectShopLocation = () => {
    navigation.navigate(AppNavigator.SelectSSOScreen, { isUpdating: true });
  };

  const onNavigationToSettings = () => {
    navigation.navigate(AppNavigator.Settings);
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      {isDrawerOpen && <FocusAwareStatusBar barStyle="dark-content" />}
      <View style={styles.topContainer}>
        <Image source={Logo} style={styles.image} resizeMode="contain" />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={navigation.closeDrawer}
        >
          <SVGs.CloseIcon color={colors.black} />
        </TouchableOpacity>
      </View>

      <DrawerListItem
        title={authStore.getName || ''}
        subtitle={authStore?.userRole}
        icon={<SVGs.ProfileIcon />}
      />
      <DrawerListItem
        onPress={onNavigateToSelectShopLocation}
        title={ssoStore.getCurrentSSO?.name || ''}
        subtitle={ssoStore.getCurrentSSO?.address}
        icon={<SVGs.CabinetIcon />}
        showChevron={isNavigationToShopSelectAvailable}
        disabled={!isNavigationToShopSelectAvailable}
      />
      <DrawerListItem
        title={t('settings')}
        icon={<SVGs.SettingsIcon />}
        showChevron
        onPress={onNavigationToSettings}
        disabled={false}
      />

      <View style={styles.bottomContainer}>
        <DrawerListButton
          onPress={handleSupportButtonPress}
          icon={<SVGs.SupportIcon color={colors.purpleDark3} />}
          title={t('support')}
          subtitle={t('howToGetAssistance')}
          disabled={false}
        />
        <DrawerListButton
          onPress={onLogout}
          icon={<SVGs.LogoutIcon2 color={colors.blue} />}
          title={t('logout')}
          disabled={false}
        />
        <Text style={styles.subtitleText}>{version}</Text>
      </View>

      <SupportAlertWrapper
        visible={isSupportAlertVisible}
        onPressPrimary={handleSupportAlertPrimaryPress}
      />
    </SafeAreaView>
  );
};

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
    fontWeight: '700',
  },
  subtitleText: {
    marginTop: 6,
    color: colors.blackLight,
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
