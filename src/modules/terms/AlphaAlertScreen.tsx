import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { authStore } from 'src/stores';
import { getUsernames, setUsernames } from 'src/helpers/localStorage';
import Pdf from 'react-native-pdf';

import WebView from 'react-native-webview';

import AlphaBetaAgreement from '../../../assets/pdf/AlphaBetaAgreement.pdf';

export const AlphaAlertScreen = () => {
  const updateUsernames = useCallback(async () => {
    const username = authStore.getUserName;
    if (username) {
      await setUsernames(username);
      const usernames = await getUsernames();
      if (usernames && usernames.usernames) {
        authStore.setUsernames(usernames.usernames);
      }
    }
  }, []);

  useEffect(() => {
    updateUsernames();
  }, [updateUsernames]);
  return (
    <View style={styles.container}>
      <Pdf
        source={AlphaBetaAgreement}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
