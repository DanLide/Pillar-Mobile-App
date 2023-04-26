import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';

import { useTimeout } from '../../../hooks';

export interface TokenParserProps
  extends Pick<WebViewProps, 'onError' | 'onHttpError'> {
  magicLink: string | null;
  onTokenReceived: (token: string) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onRequestTimeout?: () => void;
}

const REQUEST_TIMEOUT_MS = 5000;

const TokenParser: React.FC<TokenParserProps> = ({
  magicLink,
  onTokenReceived,
  onLoadStart,
  onLoadEnd,
  onRequestTimeout,
  onError,
  onHttpError,
}) => {
  const [uri, setUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const webViewRef = useRef<WebView>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    onLoadStart?.();
  }, [onLoadStart]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    onLoadEnd?.();
  }, [onLoadEnd]);

  const cancelRequest = useCallback(() => {
    if (!isLoading) return;

    webViewRef.current?.stopLoading();
    stopLoading();
    onRequestTimeout?.();
  }, [isLoading, onRequestTimeout, stopLoading]);

  useTimeout(cancelRequest, REQUEST_TIMEOUT_MS);

  useEffect(() => {
    if (!isLoading) setUri(magicLink);
  }, [isLoading, magicLink]);

  const source = useMemo<WebViewProps['source']>(
    () => (uri ? { uri } : undefined),
    [uri],
  );

  const handleRequest = useCallback<
    NonNullable<WebViewProps['onShouldStartLoadWithRequest']>
  >(
    request => {
      startLoading();
      const parts = request.url.split('#id_token=');

      if (parts.length === 2) {
        onTokenReceived(parts[1]);
        stopLoading();
        return false;
      }

      return true;
    },
    [onTokenReceived, startLoading, stopLoading],
  );

  const handleError = useCallback<NonNullable<WebViewProps['onError']>>(
    event => {
      onError?.(event);
      stopLoading();
    },
    [onError, stopLoading],
  );

  const handleHttpError = useCallback<NonNullable<WebViewProps['onHttpError']>>(
    event => {
      onHttpError?.(event);
      stopLoading();
    },
    [onHttpError, stopLoading],
  );

  return source ? (
    <WebView
      ref={webViewRef}
      containerStyle={styles.container}
      source={source}
      onShouldStartLoadWithRequest={handleRequest}
      onError={handleError}
      onHttpError={handleHttpError}
    />
  ) : null;
};

const styles = StyleSheet.create({
  container: { display: 'none' },
});

export default memo(TokenParser);
