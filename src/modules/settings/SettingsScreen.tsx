import React from 'react';
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { getDeviceNameSync } from 'react-native-device-info';
import { Separator } from 'src/components';
import { WidthType } from 'src/components/Separator';
import { colors, fonts } from 'src/theme';

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

export const SettingsScreen = () => {
  const deviceName = getDeviceNameSync();

  const sections: Section[] = [
    {
      title: 'Device Name',
      subtitle: deviceName,
      type: Type.Button,
      buttonTitle: 'Copy',
      action: () => {
        Clipboard.setString(deviceName);
      },
    },
  ];

  const renderItemActionType = (section: Section) => {
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
  };

  const renderSectionItem = ({ item }: ListRenderItemInfo<Section>) => (
    <View style={styles.sectionContainer}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subTitle}>{item.subtitle}</Text>
      </View>
      {renderItemActionType(item)}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderSectionItem}
        ItemSeparatorComponent={() => (
          <Separator widthType={WidthType.MajorPart} />
        )}
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