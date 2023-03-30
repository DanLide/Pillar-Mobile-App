import React, { useCallback, useRef } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { observer } from 'mobx-react';

import { handleExternalLinkInBrowser, TERMS_SOURCE } from './helpers';
import { Switch, Button } from '../../components';
import { authStore } from '../../stores';
import { onAcceptTerms } from '../../data/acceptTerms';
import { useLazyRequest, useSwitchState } from '../../hooks';

const TermsScreen: React.FC = () => {
  const store = useRef(authStore).current;

  const [isTermsAccepted, toggleTermsAccepted] = useSwitchState();
  const isSubmitDisabled = !isTermsAccepted;

  const [acceptTerms, { isLoading }] = useLazyRequest(onAcceptTerms);

  const onSubmitTerms = useCallback(async () => {
    const error = await acceptTerms(store);

    if (!error) return;

    Alert.alert('Error', error.message || 'Accept Terms failed!');
  }, [acceptTerms, store]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={TERMS_SOURCE}
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
          onPress={onSubmitTerms}
          isLoading={isLoading}
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
export default observer(TermsScreen);
