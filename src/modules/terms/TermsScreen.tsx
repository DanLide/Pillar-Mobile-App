import React, { useCallback, useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { observer } from 'mobx-react';

import { handleExternalLinkInBrowser, TERMS_SOURCE } from './helpers';
import { Switch, Button } from '../../components';
import { authStore, ssoStore } from '../../stores';
import { onAcceptTerms } from '../../data/acceptTerms';
import { useSwitchState } from '../../hooks';
import { AppNavigator } from '../../navigation';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Loading from '../../components/Loading';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const renderLoading = () => <Loading />;

const TermsScreen: React.FC<Props> = ({ navigation }) => {
  const store = useRef(authStore).current;

  const [isWebViewLoading, setIsWebViewLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAccepted, toggleTermsAccepted] = useSwitchState();

  const isSubmitDisabled = !isTermsAccepted || isWebViewLoading;

  const onSubmitTerms = useCallback(async () => {
    setIsLoading(true);
    const error = await onAcceptTerms(store);
    setIsLoading(false);

    if (error)
      return Alert.alert('Error', error.message || 'Accept Terms failed!');
    if (!ssoStore.getCurrentSSO) {
      return navigation.navigate(AppNavigator.SelectSSOScreen)
    }

    navigation.reset({
      index: 0,
      routes: [{ name: AppNavigator.HomeScreen }],
    });
  }, [navigation, store]);

  const startWebViewLoading = useCallback(() => setIsWebViewLoading(true), []);
  const endWebViewLoading = useCallback(() => setIsWebViewLoading(false), []);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={TERMS_SOURCE}
        onShouldStartLoadWithRequest={handleExternalLinkInBrowser}
        startInLoadingState
        renderLoading={renderLoading}
        onLoadStart={startWebViewLoading}
        onLoadEnd={endWebViewLoading}
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
