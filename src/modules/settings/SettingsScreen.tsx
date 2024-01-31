import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import { Separator } from 'src/components';
import { WidthType } from 'src/components/Separator';
import { colors, fonts } from 'src/theme';
import { authStore, deviceInfoStore, ssoStore } from 'src/stores';
import AlertWrapper from 'src/contexts/AlertWrapper';
import { cleanKeychain } from 'src/helpers/localStorage';
import { permissionProvider } from 'src/data/providers';

enum Type {
  Button,
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

export const SettingsScreen = () => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const deviceName = deviceInfoStore.getDeviceName;
  const { userPermissions } = permissionProvider;

  const openAlert = useCallback(() => setIsAlertVisible(true), []);

  const sections = useMemo<Section[]>(
    () => [
      {
        title: 'Device Name',
        subtitle: deviceName,
        type: Type.Button,
        buttonTitle: 'Copy',
        action: () => {
          Clipboard.setString(deviceName);
        },
      },
      ...(userPermissions.configureShop
        ? [
            {
              title: 'Factory Reset App',
              subtitle:
                'Restore app settings to default values.\nThis is irreversible.',
              type: Type.Button,
              buttonTitle: 'Reset',
              action: openAlert,
            },
          ]
        : []),
    ],
    [deviceName, openAlert, userPermissions.configureShop],
  );

  const renderItemActionType = useCallback((section: Section) => {
    switch (section.type) {
      case Type.Button: {
        return (
          <TouchableOpacity style={styles.button} onPress={section.action}>
            <Text style={styles.buttonText}>{section.buttonTitle}</Text>
          </TouchableOpacity>
        );
      }
      case Type.Switch:
      case Type.Empty:
        return null;
    }
  }, []);

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
    await cleanKeychain();
    closeAlert();
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
        message="Would you like to factory reset this application?"
        title="Are you sure?"
        primaryTitle="Yes"
        secondaryTitle="No"
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
