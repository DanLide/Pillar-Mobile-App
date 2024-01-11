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
import { ssoStore, authStore } from 'src/stores';
import { SSOUser } from 'src/stores/SSOStore';
import { colors, fonts, SVGs } from 'src/theme';
import { SearchIcon, CloseIcon } from 'src/theme/svgs';
import { StackNavigationProp } from '@react-navigation/stack';
import { onLoginWithToken } from 'src/data/login';
import TokenParser from './components/TokenParser';

// temp fix after back will be done
const magicLink = 'https://3maaddev.b2clogin.com/3maaddev.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_Auth_With_UserId&client_id=198e2599-5fe6-45f5-9426-72ff46dbc80b&nonce=defaultNonce&redirect_uri=https%3a%2f%2fjwt.ms%2f&scope=openid&response_type=id_token&prompt=login&user_id='

const userNotFound = 'User with such name is not found';
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
  const [isLoading, setIsLoading] = useState(false);
  const [userIdToLoginWithoutPIN, setUserIdToLoginWithoutPIN] = useState<null | string>(null);

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

  const handleTokenReceived = async (token: string) => {
    setIsLoading(true);
    await onLoginWithToken(token, authStore);
    setIsLoading(false);
    setUserIdToLoginWithoutPIN(null);
    return true;
  }

  const renderItem = useCallback(
    ({ item }: { item: SSOUser }) => {
      const title = `${item.firstName} ${item.lastName}`;
      const onPress = () => {
        if (!item.isPinRequired) {
          setUserIdToLoginWithoutPIN(item.id)
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

  if (!ssoStore.ssoUsersList || isLoading) {
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

  const renderEmptyList = () => {
    if (ssoStore.ssoUsersList && input) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {userNotFound}
          </Text>
        </View>
      )
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

  const onPressClose = () => {
    onChangeText('')
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        {renderTabs()}
        <Text style={styles.subTitle}>Select a User Account</Text>
        <View>
          <View style={styles.searchWrapper}>
            <SearchIcon color={colors.black} width={20} height={20} />
          </View>
          <TextInput
            value={input}
            style={styles.input}
            placeholder="Search User"
            placeholderTextColor={colors.grayDark2}
            onChangeText={onChangeText}
          />
          {input &&
            (
              <TouchableOpacity style={styles.closeButton} onPress={onPressClose} hitSlop={20}>
                <CloseIcon color={colors.black} width={9} height={9} color={colors.neutral40} />
              </TouchableOpacity>
            )
          }
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
        ListEmptyComponent={renderEmptyList()}
      />
      <SafeAreaView style={styles.buttonWrapper}>
        <Button
          type={ButtonType.secondary}
          title="Login with Username"
          buttonStyle={styles.loginButton}
          onPress={onLoginViaCredentials}
        />
        <TokenParser
          magicLink={userIdToLoginWithoutPIN ? `${magicLink}${userIdToLoginWithoutPIN}` : userIdToLoginWithoutPIN}
          onTokenReceived={handleTokenReceived}
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
    paddingVertical: 7,
    paddingHorizontal: 37,
    marginVertical: 8,
  },
  searchWrapper: {
    position: 'absolute',
    left: '3%',
    top: '30%',
  },
  closeButton: {
    position: 'absolute',
    right: '5%',
    top: '42%',
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
    marginBottom: 16,
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
