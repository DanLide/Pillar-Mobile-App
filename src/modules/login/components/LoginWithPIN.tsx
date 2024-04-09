import { memo, useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import TokenParser, { TokenParserProps } from './TokenParser';

export type LoginWithPINProps = Pick<TokenParserProps, 'onTokenReceived'>;

// TODO: remove this when magic link generation is implemented
const MAGIC_LINK =
  'https://3maaddev.b2clogin.com/3maaddev.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_Auth_With_UserId&client_id=5a060590-680c-4253-96c7-dd2adcfbddaf&nonce=defaultNonce&redirect_uri=https%3a%2f%2fjwt.ms&scope=openid&response_type=id_token&prompt=login&user_id=e81dd3dc-9317-4b1d-aa21-af92af55dfa4';

const LoginWithPIN: React.FC<LoginWithPINProps> = ({ onTokenReceived }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingStart = useCallback(() => setIsLoading(true), []);
  const handleLoadingEnd = useCallback(() => setIsLoading(false), []);

  const handleError = useCallback<NonNullable<TokenParserProps['onError']>>(
    ({ nativeEvent: { description } }) =>
      Alert.alert(`Could not log in with a PIN: ${description}`),
    [],
  );

  const handleHttpError = useCallback<
    NonNullable<TokenParserProps['onHttpError']>
  >(
    ({ nativeEvent: { statusCode } }) =>
      Alert.alert(`Magic link error with ${statusCode} code`),
    [],
  );

  const handleRequestTimeout = useCallback<
    NonNullable<TokenParserProps['onRequestTimeout']>
  >(() => Alert.alert(`Magic link timeout`), []);

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" />}
      <TokenParser
        magicLink={MAGIC_LINK}
        onTokenReceived={onTokenReceived}
        onLoadStart={handleLoadingStart}
        onLoadEnd={handleLoadingEnd}
        onError={handleError}
        onHttpError={handleHttpError}
        onRequestTimeout={handleRequestTimeout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', padding: 20, gap: 10 },
  linkHandler: { display: 'none' },
});

export default memo(LoginWithPIN);
