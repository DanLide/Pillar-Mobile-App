import React, { useCallback, useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { observer } from 'mobx-react';

import { handleExternalLinkInBrowser, TERMS_SOURCE } from './helpers';
import { Switch, Button } from '../../components';
import { authStore } from '../../stores';
import { onAcceptTerms } from '../../data/acceptTerms';
import { useSwitchState } from '../../hooks';
import { AppNavigator } from '../../navigation';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const TermsScreen: React.FC<Props> = ({ navigation }) => {
  const store = useRef(authStore).current;

  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAccepted, toggleTermsAccepted] = useSwitchState();

  const onSubmitTerms = useCallback(async () => {
    setIsLoading(true);
    const error = await onAcceptTerms(store);
    setIsLoading(false);

    if (error)
      return Alert.alert('Error', error.message || 'Accept Terms failed!');

    navigation.reset({
      index: 0,
      routes: [{ name: AppNavigator.HomeScreen }],
    });
  }, [navigation, store]);

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
          disabled={!isTermsAccepted}
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
