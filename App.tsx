import React from 'react';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet } from 'react-native';

import { AppStack } from './src/navigation';

interface InitialProps {
  [key: string]: string;
}

const App = (initialProps: InitialProps) => {
  console.log(initialProps['rntoken']);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="never"
      bounces={false}
    >
      <SafeAreaProvider>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
