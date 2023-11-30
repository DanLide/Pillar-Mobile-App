import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { authStore } from 'src/stores';
import { getUsernames, setUsernames } from 'src/helpers/localStorage';

import WebView from 'react-native-webview';

import AlphaBetaAgreement from '../../assets/AlphaBetaAgreement.pdf';

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
      <WebView style={styles.container} source={AlphaBetaAgreement} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
