import React, { useEffect } from 'react';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView, View, StyleSheet } from 'react-native';
import TrackPlayer from 'react-native-track-player';

import { AppStack } from './src/navigation';
import autoLogoutService from "./src/data/helpers/autologoutService";
import { addTracks, setupPlayer } from './src/components/Sound';

interface InitialProps {
  [key: string]: string;
}

const App = (initialProps: InitialProps) => {

  useEffect(() => {
    async function setup() {
      await setupPlayer();

      const queue = await TrackPlayer.getQueue();
      if (queue.length <= 0) {
        await addTracks();
      }
    }
    setup();
  }, []);

  console.log(initialProps['rntoken']);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="never"
      bounces={false}
      horizontal={true}
    >
      <View
        style={styles.container}
        onStartShouldSetResponderCapture={() => {
          autoLogoutService.onTouch();
          return false;
        }}
      >
        <SafeAreaProvider>
          <NavigationContainer>
            <AppStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
