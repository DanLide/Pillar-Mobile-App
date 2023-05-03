import React, { useCallback, useMemo, useRef } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { AppNavigator } from '../../navigation';
import { authStore, ssoStore } from '../../stores';
import { SelectSSOStore } from './stores/SelectSSOStore';
import { Button, Input, InfoTitleBar, ButtonType } from '../../components';
import { colors, SVGs } from '../../theme';
import { SSOList, SSOListProps } from './components';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const SelectSSOScreen: React.FC<Props> = ({ navigation }) => {
  const store = useRef(new SelectSSOStore(ssoStore)).current;

  const selectedSSOId = store.preselectedSSO?.pisaId;

  const data = useMemo(() => store.searchedSSO || [], [store.searchedSSO]);

  const onChangeText = (value: string) => {
    store.setSearchInSSOList(value);
  };

  const preselectSSO = useCallback<NonNullable<SSOListProps['onPressItem']>>(
    item => store.preselectSSO(item),
    [store],
  );

  const onPressSubmit = () => {
    if (store.preselectedSSO) {
      store.setCurrentSSO();
      navigation.reset({
        index: 0,
        routes: [{ name: AppNavigator.HomeScreen }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <InfoTitleBar title={authStore.getName} />
      <Input
        containerStyle={styles.input}
        placeholder="Select a Shop Location"
        rightIcon={SVGs.SearchIcon}
        onChangeText={onChangeText}
        value={store.searchInSSOList}
      />
      <SSOList
        data={data}
        contentContainerStyle={styles.list}
        onPressItem={preselectSSO}
        selectedSSOId={selectedSSOId}
      />
      <Button
        disabled={!store.preselectedSSO}
        buttonStyle={styles.buttonStyle}
        onPress={onPressSubmit}
        title="Submit"
        type={ButtonType.primary}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  input: {
    marginHorizontal: 13,
    marginVertical: 18.5,
  },
  list: {
    paddingBottom: 16,
  },
  buttonStyle: {
    height: 65.5,
    marginHorizontal: 18.5,
    marginVertical: 28,
  },
});

export default observer(SelectSSOScreen);
