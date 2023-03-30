import { WebViewProps } from 'react-native-webview';
import English from '../../../strings/terms/English';
import { Linking } from 'react-native';

export const TERMS_SOURCE: WebViewProps['source'] = { html: English };

export const handleExternalLinkInBrowser: WebViewProps['onShouldStartLoadWithRequest'] =
  request => {
    if (request.url !== 'about:blank') {
      Linking.openURL(request.url);
      return false;
    } else return true;
  };
