import React, { memo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleExternalLinkInBrowser, SOURCE_DEFAULT } from './helpers/webview';

const TermsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={SOURCE_DEFAULT}
        onShouldStartLoadWithRequest={handleExternalLinkInBrowser}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
export default memo(TermsScreen);
