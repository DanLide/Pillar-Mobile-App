import React, { memo } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleExternalLinkInBrowser, SOURCE_DEFAULT } from './helpers/webview';
import useSwitchState from '../../hooks/useSwitchState';
import Switch from '../../components/Switch';

const TermsScreen: React.FC = () => {
  const [isTermsAccepted, toggleTermsAccepted] = useSwitchState();

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={SOURCE_DEFAULT}
        onShouldStartLoadWithRequest={handleExternalLinkInBrowser}
      />
      <View style={styles.controlsContainer}>
        <Switch
          value={isTermsAccepted}
          onPress={toggleTermsAccepted}
          label="I agree to Terms"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  controlsContainer: { padding: 16 },
});
export default memo(TermsScreen);
