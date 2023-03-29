import React, { memo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WebView, { WebViewProps } from 'react-native-webview';
import English from '../../../strings/terms/English';

const SOURCE_DEFAULT: WebViewProps['source'] = { html: English };

const TermsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView source={SOURCE_DEFAULT} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
export default memo(TermsScreen);
