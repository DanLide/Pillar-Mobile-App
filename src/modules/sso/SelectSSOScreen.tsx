import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { observer } from 'mobx-react';

import {
  AppNavigator,
  HomeStackParamList,
  LeftBarType,
} from '../../navigation/types';
import { authStore, ssoStore } from '../../stores';
import { SelectSSOStore } from './stores/SelectSSOStore';
import {
  Button,
  Input,
  InfoTitleBar,
  ButtonType,
  InfoTitleBarType,
} from '../../components';
import { colors, SVGs } from '../../theme';
import { SSOList, SSOListProps } from './components';
import { getScreenOptions } from '../../navigation/helpers';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { NativeStackNavigationEventMap } from 'react-native-screens/lib/typescript/native-stack/types';
import { stocksStore } from '../stocksList/stores';

type Props = NativeStackScreenProps<
  HomeStackParamList,
  AppNavigator.SelectSSOScreen
>;

export const SelectSSOScreen: React.FC<Props> = observer(
  ({ navigation, route }) => {
    const isUpdating = route.params?.isUpdating;
    const store = useRef(new SelectSSOStore(ssoStore)).current;
    const listRef = useRef<FlatList | null>(null);
    const [isChangedSelectedValue, setIsChangedSelectedValue] =
      useState<boolean>(false);
    const selectedSSOId = store.preselectedSSO?.pisaId;

    const data = useMemo(() => store.searchedSSO || [], [store.searchedSSO]);

    const onChangeText = (value: string) => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
      store.setSearchInSSOList(value);
    };

    const preselectSSO = useCallback<NonNullable<SSOListProps['onPressItem']>>(
      item => {
        store.preselectSSO(item);
        setIsChangedSelectedValue(true);
      },
      [store],
    );

    const onPressSubmit = () => {
      if (store.preselectedSSO) {
        stocksStore.clear();
        store.setCurrentSSO();
        navigation.reset({
          routes: [{ name: AppNavigator.Drawer }],
        });
      }
    };

    useEffect(() => {
      if (isUpdating) {
        if (ssoStore.getCurrentSSO) store.preselectSSO(ssoStore.getCurrentSSO);

        navigation.setOptions(
          getScreenOptions({
            title: 'Update Location',
            leftBarButtonType: LeftBarType.Back,
          }) as Partial<NativeStackNavigationEventMap>,
        );
      }
    }, [isUpdating, navigation, store]);

    return (
      <View style={styles.container}>
        <InfoTitleBar
          type={InfoTitleBarType.Secondary}
          title={authStore.getName}
        />
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
          ref={listRef}
        />
        <Button
          disabled={!store.preselectedSSO || !isChangedSelectedValue}
          buttonStyle={styles.buttonStyle}
          onPress={onPressSubmit}
          title={isUpdating ? 'Update' : 'Submit'}
          type={ButtonType.primary}
        />
      </View>
    );
  },
);

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
