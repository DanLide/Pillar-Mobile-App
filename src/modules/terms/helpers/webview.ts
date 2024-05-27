import { WebViewProps } from 'react-native-webview';
import { Linking } from 'react-native';

export const handleExternalLinkInBrowser: WebViewProps['onShouldStartLoadWithRequest'] =
  request => {
    if (request.url !== 'about:blank') {
      Linking.openURL(request.url);
      return false;
    } else return true;
  };
