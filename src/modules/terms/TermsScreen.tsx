import React, { useCallback, useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { observer } from 'mobx-react';

import { handleExternalLinkInBrowser, TERMS_SOURCE } from './helpers';
import {
  Button,
  Checkbox,
  InfoTitleBar,
  ButtonType,
  InfoTitleBarType,
} from '../../components';
import { authStore, ssoStore } from '../../stores';
import { onAcceptTerms } from '../../data/acceptTerms';
import { useSwitchState } from '../../hooks';
import { AppNavigator } from '../../navigation/types';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Loading from '../../components/Loading';
import { colors, fonts } from '../../theme';

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
      return navigation.navigate(AppNavigator.SelectSSOScreen);
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
      <InfoTitleBar type={InfoTitleBarType.Secondary} title={store.getName} />
      <WebView
        source={TERMS_SOURCE}
        onShouldStartLoadWithRequest={handleExternalLinkInBrowser}
        startInLoadingState
        renderLoading={renderLoading}
        onLoadStart={startWebViewLoading}
        onLoadEnd={endWebViewLoading}
        containerStyle={styles.webView}
      />
      <View style={styles.controlsContainer}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            isChecked={isTermsAccepted}
            onChange={toggleTermsAccepted}
          />
          <Text style={styles.checkboxTitle}>Accept Terms & Conditions</Text>
        </View>
        <Button
          type={ButtonType.primary}
          title="Next"
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
  container: { flex: 1, backgroundColor: colors.white },
  controlsContainer: { paddingHorizontal: 16, marginBottom: 24 },
  submitButton: { marginTop: 56, height: 65.5, width: '100%' },
  webView: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  checkboxTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: colors.purpleDark,
    fontFamily: fonts.TT_Bold,
    paddingLeft: 8,
  },
});

export default observer(TermsScreen);
