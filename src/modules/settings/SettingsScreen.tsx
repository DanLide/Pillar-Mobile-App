import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useTranslation } from 'react-i18next';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Separator, Switch } from 'src/components';
import { WidthType } from 'src/components/Separator';
import { colors, fonts, SVGs } from 'src/theme';
import { authStore, deviceInfoStore, ssoStore } from 'src/stores';
import AlertWrapper from 'src/contexts/AlertWrapper';
import { cleanKeychain, getSettings, setSettings } from 'src/helpers/storage';
import { permissionProvider } from 'src/data/providers';
import { onRemoveDeviceFromSSO } from 'src/data/removeDeviceFromSSO';
import { AppNavigator } from 'src/navigation/types';
import { stocksStore } from '../stocksList/stores';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

enum Type {
  Button,
  Chevron,
  Switch,
  Empty,
}

interface Section {
  title: string;
  subtitle: string;
  type: Type;
  buttonTitle?: string;
  action?: () => void;
}

const ItemSeparatorComponent = () => (
  <Separator widthType={WidthType.MajorPart} />
);

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const settings = getSettings();

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const deviceName = deviceInfoStore.getDeviceName;
  const { userPermissions } = permissionProvider;

  const openAlert = useCallback(() => setIsAlertVisible(true), []);

  const [isEnabledFlashlight, setIsFlashlightEnabled] = useState(
    !!settings.isEnabledFlashlight,
  );

  const toggleSwitchFlashlight = useCallback(() => {
    setSettings({ ...settings, isEnabledFlashlight: !isEnabledFlashlight });
    setIsFlashlightEnabled(!isEnabledFlashlight);
  }, [isEnabledFlashlight, settings]);

  const sections = useMemo<Section[]>(
    () => [
      {
        title: t('appVersion'),
        subtitle: deviceInfoStore.version,
        type: Type.Empty,
      },
      {
        title: t('language'),
        subtitle: t(i18n.language),
        type: Type.Chevron,
        action: () => {
          navigation.navigate(AppNavigator.LanguageSelectScreen, {
            isSettings: true,
          });
        },
      },
      {
        title: t('flashlightDefaultSetting'),
        subtitle: t('turnOnScanningWithFlashlight'),
        type: Type.Switch,
      },
      {
        title: t('deviceName'),
        subtitle: deviceName,
        type: Type.Button,
        buttonTitle: t('copy'),
        action: () => {
          Clipboard.setString(deviceName);
        },
      },
      ...(userPermissions.configureShop
        ? [
            {
              title: t('factoryResetApp'),
              subtitle: t('restoreAppSettings'),
              type: Type.Button,
              buttonTitle: t('reset'),
              action: openAlert,
            },
          ]
        : []),
    ],
    [
      t,
      i18n.language,
      deviceName,
      userPermissions.configureShop,
      openAlert,
      navigation,
    ],
  );

  const renderItemActionType = useCallback(
    (section: Section) => {
      switch (section.type) {
        case Type.Button: {
          return (
            <TouchableOpacity style={styles.button} onPress={section.action}>
              <Text style={styles.buttonText}>{section.buttonTitle}</Text>
            </TouchableOpacity>
          );
        }
        case Type.Chevron: {
          return (
            <TouchableOpacity style={styles.button} onPress={section.action}>
              <SVGs.ChevronIcon color={colors.purpleDark} />
            </TouchableOpacity>
          );
        }
        case Type.Switch:
          return (
            <Switch
              value={isEnabledFlashlight}
              onPress={toggleSwitchFlashlight}
              trackColor={{ true: colors.purple }}
            />
          );
        case Type.Empty:
          return null;
      }
    },
    [isEnabledFlashlight, toggleSwitchFlashlight],
  );

  const renderSectionItem = useCallback(
    ({ item }: ListRenderItemInfo<Section>) => (
      <View style={styles.sectionContainer}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subTitle}>{item.subtitle}</Text>
        </View>
        {renderItemActionType(item)}
      </View>
    ),
    [renderItemActionType],
  );

  const closeAlert = useCallback(() => setIsAlertVisible(false), []);

  const handleResetConfirm = useCallback(async () => {
    await onRemoveDeviceFromSSO();
    cleanKeychain();
    closeAlert();
    deviceInfoStore.getInitialDeviceName();
    stocksStore.clearSSOStocks();
    ssoStore.setDeviceConfiguration(false);
    authStore.logOut();
  }, [closeAlert]);

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderSectionItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
      <AlertWrapper
        visible={isAlertVisible}
        message={t('wouldYouLikeFactoryReset')}
        title={t('areYouSure')}
        primaryTitle={t('yes')}
        secondaryTitle={t('no')}
        onPressPrimary={handleResetConfirm}
        onPressSecondary={closeAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Bold,
    color: colors.blackSemiLight,
  },
  subTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark,
  },
  button: {
    padding: 12,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Regular,
    color: colors.purpleDark,
  },
});
