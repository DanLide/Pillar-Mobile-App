import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { AppNavigator } from '../../navigation';

import { Button } from '../../components';

import { authStore } from '../../stores';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const LanguageSelectScreen: React.FC<Props> = ({ navigation }) => {
  const onSelectLanguage = () => {
    // TODO: make API call and handle errors
    !authStore.isTnCSelected
      ? navigation.navigate(AppNavigator.TermsScreen)
      : navigation.reset({
          index: 0,
          routes: [{ name: AppNavigator.HomeScreen }],
        });
  };

  return (
    <View style={styles.container}>
      <Text>Language select screen</Text>
      <Button
        buttonStyle={styles.button}
        title="Accept"
        onPress={onSelectLanguage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    margin: 16,
  },
});
