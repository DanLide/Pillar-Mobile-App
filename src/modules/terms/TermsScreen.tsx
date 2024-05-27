import { useCallback, useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { handleExternalLinkInBrowser } from './helpers';
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

import en_US_Terms from 'src/strings/terms/en_US_Terms';
import fr_CA_Terms from 'src/strings/terms/fr_CA_Terms';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

type termsType = {
  [key: string]: string;
};

const allLanguageTerms: termsType = {
  en_US: en_US_Terms,
  fr_CA: fr_CA_Terms,
};

const renderLoading = () => <Loading />;

const TermsScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
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
      return Alert.alert('Error', error.message || t('acceptTermsfailed'));
    if (!ssoStore.getCurrentSSO) {
      return navigation.navigate(AppNavigator.SelectSSOScreen);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: AppNavigator.Drawer }],
    });
  }, [navigation, store, t]);

  const startWebViewLoading = useCallback(() => setIsWebViewLoading(true), []);
  const endWebViewLoading = useCallback(() => setIsWebViewLoading(false), []);

  return (
    <SafeAreaView style={styles.container}>
      <InfoTitleBar type={InfoTitleBarType.Secondary} title={store.getName} />
      <WebView
        source={{ html: allLanguageTerms[i18n.language] }}
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
          <Text style={styles.checkboxTitle}>{t('acceptTermsConditions')}</Text>
        </View>
        <Button
          type={ButtonType.primary}
          title={t('next')}
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
