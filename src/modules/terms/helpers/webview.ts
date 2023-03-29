import { WebViewProps } from 'react-native-webview';
import English from '../../../strings/terms/English';
import { Linking } from 'react-native';

export const SOURCE_DEFAULT: WebViewProps['source'] = { html: English };

export const handleExternalLinkInBrowser: WebViewProps['onShouldStartLoadWithRequest'] =
  request => {
    if (request.url !== 'about:blank') {
      Linking.openURL(request.url);
      return false;
    } else return true;
  };
