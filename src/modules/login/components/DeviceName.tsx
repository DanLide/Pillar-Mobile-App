import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';

import { deviceInfoStore } from 'src/stores';

export const DeviceName = observer(() => {
  const onChangeDeviceName = () => {
    Alert.prompt(
      'Set device name',
      '',
      [
        {
          text: 'Save',
          onPress: (value?: string) => {
            if (value) deviceInfoStore.setDeviceName(value);
          },
        },
        { text: 'Cancel' },
      ],
      'plain-text',
      deviceInfoStore.getDeviceName,
    );
  };

  return (
    <View style={styles.container}>
      <Text>Device Name: {deviceInfoStore.getDeviceName}</Text>
      <Pressable onPress={onChangeDeviceName} style={styles.button}>
        <Text>Update</Text>
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
