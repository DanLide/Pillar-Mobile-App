import React, { memo } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleExternalLinkInBrowser, SOURCE_DEFAULT } from './helpers/webview';
import useSwitchState from '../../hooks/useSwitchState';
import { Switch, Button } from '../../components';

const TermsScreen: React.FC = () => {
  const [isTermsAccepted, toggleTermsAccepted] = useSwitchState();

  const isSubmitDisabled = !isTermsAccepted;

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
        <Button
          title="Submit"
          disabled={isSubmitDisabled}
          buttonStyle={styles.submitButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  controlsContainer: { padding: 16, paddingBottom: 0 },
  submitButton: { marginTop: 8 },
});
export default memo(TermsScreen);
