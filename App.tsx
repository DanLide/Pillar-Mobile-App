import { useState, useEffect, useCallback } from 'react';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  SafeAreaView,
  AppState,
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import SplashScreen from 'react-native-splash-screen';
import { observer } from 'mobx-react';

import { initI18n } from 'src/libs/translation';
import { AppStack } from './src/navigation';
import { addTracks, setupPlayer } from './src/components/Sound';

import autoLogoutService, {
  AUTO_LOGOUT_TIMEOUT,
} from './src/data/helpers/autologoutService';
import splashScreenBackground from './assets/images/SplashScreenBackground.jpg';
import splashScreenLogo from './assets/images/logo.jpg';
import { colors, fonts } from './src/theme';
import { getSSORNToken, getUsernames } from 'src/helpers/storage';
import { authStore, deviceInfoStore, ssoStore } from 'src/stores';
import { ToastProvider } from 'src/contexts';

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

const { width, height } = Dimensions.get('window');
const backgroundImageSize = {
  width,
  height,
};
const version = `Version ${deviceInfoStore.version}`;

const App = observer(() => {
  const [appState, setAppState] = useState('active');

  useEffect(() => {
    initI18n();
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    async function setup() {
      await setupPlayer();

      const queue = await TrackPlayer.getQueue();
      if (queue.length <= 0) {
        await addTracks();
      }
    }
    setup();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (!autoLogoutService.lastTouchTimeStamp) {
        return;
      }
      const delayNeed =
        nextAppState === 'active' &&
        new Date().getTime() - autoLogoutService.lastTouchTimeStamp.getTime() >
          AUTO_LOGOUT_TIMEOUT;

      delayNeed
        ? setTimeout(() => {
            // need to logout animation be done
            setAppState(nextAppState);
          }, 350)
        : setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const getSSORNTokenData = useCallback(() => {
    const data = getSSORNToken();

    if (data) {
      ssoStore.setCurrentSSO(data.sso);
      ssoStore.setDeviceConfiguration(true);
    }
  }, []);

  useEffect(() => {
    getSSORNTokenData();
  }, [getSSORNTokenData]);

  const getUsernamesData = useCallback(() => {
    const data = getUsernames();
    if (data && data.usernames) {
      authStore.setUsernames(data.usernames);
    }
  }, []);

  useEffect(() => {
    getUsernamesData();
  }, [getUsernamesData]);

  const renderSplashScreen = () => {
    if (appState === 'active') {
      return null;
    }

    return (
      <View style={[backgroundImageSize, styles.splashContainer]}>
        <Image source={splashScreenBackground} style={backgroundImageSize} />
        <Image
          resizeMode="contain"
          source={splashScreenLogo}
          style={styles.splashImageBackground}
        />
        <SafeAreaView style={styles.versionContainer}>
          <Text style={styles.versionText}>{version}</Text>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="never"
      bounces={false}
      horizontal={true}
    >
      {renderSplashScreen()}
      <View
        style={[
          styles.container,
          appState !== 'active' && styles.mainContainerHidden,
        ]}
        onStartShouldSetResponderCapture={() => {
          autoLogoutService.onTouch();
          return false;
        }}
      >
        <KeyboardProvider>
          <ToastProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <AppStack />
              </NavigationContainer>
            </SafeAreaProvider>
          </ToastProvider>
        </KeyboardProvider>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainerHidden: {
    opacity: 0,
  },
  splashImageBackground: {
    width: 282,
    height: 48,
    position: 'absolute',
    zIndex: 1,
    top: '47%',
    alignSelf: 'center',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  versionText: {
    color: colors.grayDark2,
    fontFamily: fonts.TT_Regular,
  },
  splashContainer: {
    position: 'absolute',
  },
});

export default App;
