import React, { memo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const TermsEnglish = require('../../../../assets/terms/English.html');
const ORIGIN_WHITELIST = ['*'];

const TermsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView source={TermsEnglish} originWhitelist={ORIGIN_WHITELIST} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
export default memo(TermsScreen);
