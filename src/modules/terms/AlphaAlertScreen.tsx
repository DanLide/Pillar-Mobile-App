import { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { authStore } from 'src/stores';
import { getUsernames, setUsernames } from 'src/helpers/storage';
import Pdf from 'react-native-pdf';

import en_US_AlphaBetaAgreement from 'assets/pdf/AlphaBetaAgreementEN.pdf';
import fr_CA_AlphaBetaAgreement from 'assets/pdf/AlphaBetaAgreementFR.pdf';

type termsType = Record<string, number>;

const allAlphaBetaAgreement: termsType = {
  en_US: en_US_AlphaBetaAgreement,
  fr_CA: fr_CA_AlphaBetaAgreement,
};

export const AlphaAlertScreen = () => {
  const { i18n } = useTranslation();
  const updateUsernames = useCallback(() => {
    const username = authStore.getUserName;
    if (username) {
      setUsernames(username);
      const usernames = getUsernames();
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
        source={allAlphaBetaAgreement[i18n.language]}
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
