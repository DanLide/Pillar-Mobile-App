import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { deviceInfoStore } from 'src/stores';

export const DeviceName = observer(() => {
  const { t } = useTranslation();
  const onChangeDeviceName = () => {
    Alert.prompt(
      t('setDeviceName'),
      '',
      [
        {
          text: t('save'),
          onPress: (value?: string) => {
            if (value) deviceInfoStore.setDeviceName(value);
          },
        },
        { text: t('cancel') },
      ],
      'plain-text',
      deviceInfoStore.getDeviceName,
    );
  };

  return (
    <View style={styles.container}>
      <Text>
        {t('deviceName')}: {deviceInfoStore.getDeviceName}
      </Text>
      <Pressable onPress={onChangeDeviceName} style={styles.button}>
        <Text>{t('update')}</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    padding: 16,
  },
});
