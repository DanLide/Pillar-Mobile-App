import React, { useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';
import { observer } from 'mobx-react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { AppNavigator } from '../../navigation';

import { Input } from '../../components';
import { SSOModel } from '../../stores/SSOStore';
import { authStore, ssoStore } from '../../stores';
import { SelectSSOStore } from './stores/SelectSSOStore';
import { Button } from '../../components';
import UsernameBar from '../../components/UsernameBar';
import { colors } from '../../theme';
import { SearchIcon } from '../../theme/svgs';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const keyExtractor = (item: SSOModel) => String(item.pisaId);

export const SelectSSOScreen: React.FC<Props> = ({ navigation }) => {
  const store = useRef(new SelectSSOStore(ssoStore)).current;

  const data = store.searchedSSO || [];

  const onChangeText = (value: string) => {
    store.setSearchInSSOList(value);
  };

  const onPressSubmit = () => {
    if (store.preselectedSSO) {
      store.setCurrentSSO();
      navigation.reset({
        index: 0,
        routes: [{ name: AppNavigator.HomeScreen }],
      });
    }
  };

  const renderItem = ({ item }: { item: SSOModel }) => {
    const onPress = () => {
      store.preselectSSO(item);
    };
    const isSelected =
      JSON.stringify(item) === JSON.stringify(store.preselectedSSO);
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={onPress}
      >
        <Text style={styles.title}>{item.name}</Text>
        {item.address && <Text style={styles.title}>{item.address}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <UsernameBar username={authStore.getName} />
      <Input
        containerStyle={styles.input}
        placeholder="Select a Shop Location"
        rightIcon={SearchIcon}
        onChangeText={onChangeText}
        value={store.searchInSSOList}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
      />
      <Button
        title="Submit"
        disabled={!store.preselectedSSO}
        buttonStyle={styles.buttonStyle}
        onPress={onPressSubmit}
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
    margin: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  item: {
    backgroundColor: '#e4e4e4',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  selectedItem: {
    backgroundColor: '#989898',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonStyle: {
    margin: 16,
  },
});

export default observer(SelectSSOScreen);
