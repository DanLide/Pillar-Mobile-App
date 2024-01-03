import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, ButtonType } from 'src/components';

import { fetchSSOUsers } from 'src/data/fetchSSOUsers';
import { AppNavigator, UnauthStackParamsList } from 'src/navigation/types';
import { ssoStore } from 'src/stores';
import { SSOUser } from 'src/stores/SSOStore';
import { colors, fonts, SVGs } from 'src/theme';
import { SearchIcon } from 'src/theme/svgs';
import { StackNavigationProp } from '@react-navigation/stack';

const titleError =
  'Sorry, we are unable to identify the users at this shop location right now. To continue, you may choose to login with your username.';

interface Props {
  navigation: StackNavigationProp<
    UnauthStackParamsList,
    AppNavigator.LoginViaPinScreen
  >;
}

export const LoginViaPinScreen = observer(({ navigation }: Props) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [input, setInput] = useState('');

  const fetchUsers = () => {
    fetchSSOUsers(ssoStore);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onPressTab = (index: number) => {
    if (selectedTabIndex === index) return;
    setSelectedTabIndex(index);
  };

  const onChangeText = (value: string) => {
    setInput(value);
  };

  const renderItem = useCallback(
    ({ item }: { item: SSOUser }) => {
      const title = `${item.firstName} ${item.lastName}`;
      const onPress = () => {
        if (!item.isPinRequired) {
          // TODO
          return;
        }

        return navigation.navigate(
          item.isPinSet
            ? AppNavigator.LoginWithPinScreen
            : AppNavigator.CreatePinScreen,
          {
            username: title,
            b2cUserId: item.b2CId,
          },
        );
      };

      return (
        <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemRole}>{item.role}</Text>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  if (!ssoStore.ssoUsersList) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  const users = ssoStore.SsoSeparatedUsersList?.[selectedTabIndex];

  const onLoginViaCredentials = () => {
    navigation.navigate(AppNavigator.LoginViaCredentialsScreen);
  };

  const renderTabs = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => {
            onPressTab(0);
          }}
          style={[
            styles.tabButton,
            selectedTabIndex === 0 && styles.selectedButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              selectedTabIndex === 0 && styles.selectedButtonText,
            ]}
          >
            Repair Facility
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPressTab(1);
          }}
          style={[
            styles.tabButton,
            selectedTabIndex === 1 && styles.selectedButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              selectedTabIndex === 1 && styles.selectedButtonText,
            ]}
          >
            Distributors
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderError = () => {
    if (ssoStore.ssoUsersList) {
      return null;
    }
    return (
      <View style={styles.errorContainer}>
        <SVGs.UserNotFound />
        <Text style={styles.errorText}>{titleError}</Text>
        <Button
          type={ButtonType.secondary}
          title="Retry"
          onPress={fetchUsers}
          buttonStyle={styles.retryButton}
        />
      </View>
    );
  };

  const filteredList = users.filter(item => {
    const title = `${item.firstName} ${item.lastName}`;
    return title.toLowerCase().includes(input.toLowerCase());
  });

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        {renderTabs()}
        <Text style={styles.subTitle}>Select a User Account</Text>
        <View>
          <TextInput
            value={input}
            style={styles.input}
            placeholder="Search User"
            placeholderTextColor={colors.grayDark2}
            onChangeText={onChangeText}
          />
          <View style={styles.searchWrapper}>
            <SearchIcon color={colors.black} width={20} height={20} />
          </View>
          <View>{/* {filterIcon button here in v2} */}</View>
        </View>
        <View style={styles.listTitleContainer}>
          <Text style={styles.listTitleText}>Employee</Text>
          <Text style={styles.listTitleText}>Role</Text>
        </View>
      </View>
      <FlatList
        data={filteredList}
        renderItem={renderItem}
        ListEmptyComponent={renderError()}
      />
      <SafeAreaView style={styles.buttonWrapper}>
        <Button
          type={ButtonType.secondary}
          title="Login with Username"
          buttonStyle={styles.loginButton}
          onPress={onLoginViaCredentials}
        />
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  loading: {
    padding: 16,
  },
  screenContainer: {
    backgroundColor: colors.grayLight,
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray,
    marginTop: 6,
    borderRadius: 8,
    padding: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: colors.white,
  },
  buttonText: {
    fontFamily: fonts.TT_Regular,
    color: colors.textNeutral,
    fontSize: 15,
  },
  selectedButtonText: {
    fontWeight: '700',
  },
  subTitle: {
    color: colors.blackLight,
    fontFamily: fonts.TT_Regular,
    fontSize: 15,
    alignSelf: 'center',
    marginVertical: 8,
  },
  input: {
    borderColor: colors.neutral30,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 18,
    paddingLeft: 12,
    paddingVertical: 7,
    paddingRight: 37,
    marginVertical: 8,
  },
  searchWrapper: {
    position: 'absolute',
    right: '3%',
    top: '30%',
  },
  listTitleText: {
    fontSize: 12,
    color: colors.blackSemiLight,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    fontWeight: '700',
  },
  listTitleContainer: {
    marginTop: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginBottom: 1,
    paddingHorizontal: 18,
  },
  itemTitle: {
    fontSize: 13,
    color: colors.purpleDark,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    fontWeight: '700',
  },
  itemRole: {
    fontSize: 13,
    color: colors.grayDark3,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
  },
  buttonWrapper: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: colors.white,
  },
  loginButton: {
    marginTop: 10,
    marginHorizontal: 15,
  },
  errorText: {
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark2,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 14,
  },
  errorContainer: {
    flex: 1,
    marginTop: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});
