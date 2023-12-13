import React, { useCallback, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { Input } from 'src/components';
import { RoleType, UserType } from 'src/constants/common.enum';
import { colors, fonts } from 'src/theme';
import { SearchIcon } from 'src/theme/svgs';

const mockedList = [
  {
    Id: 'Id1',
    B2Cid: 'B2Cid1',
    FirstName: 'Kamren',
    LastName: 'Corkery',
    Role: RoleType.Technician,
    UserType: UserType.SSO,
  },
  {
    Id: 'Id2',
    B2Cid: 'B2Cid2',
    FirstName: 'Andrii',
    LastName: 'Narn',
    Role: RoleType.DistributorRegionalManager,
    UserType: UserType.Distributor,
  },
]


export const LoginViaPinScreen = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [input, setInput] = useState('');

  const onPressTab = (index: number) => {
    if (selectedTabIndex === index) return
    setSelectedTabIndex(index)
  };

  const onChangeText = (value) => {
    setInput(value);
  }

  const renderTabs = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => {
            onPressTab(0)
          }}
          style={
            [styles.tabButton,
            selectedTabIndex === 0 && styles.selectedButton
            ]
          }>
          <Text style={[
            styles.buttonText,
            selectedTabIndex === 0 && styles.selectedButtonText
          ]}>
            Repair Facility
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPressTab(1)
          }}
          style={
            [styles.tabButton,
            selectedTabIndex === 1 && styles.selectedButton
            ]
          }>
          <Text style={[
            styles.buttonText,
            selectedTabIndex === 1 && styles.selectedButtonText
          ]}>
            Distributors
          </Text>
        </TouchableOpacity>
      </View >
    )
  }

  const renderItem = useCallback(({ item }) => {
    const title = `${item.FirstName} ${item.LastName}`
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.itemTitle}>
          {title}
        </Text>
        <Text style={styles.itemRole}>
          {item.Role}
        </Text>
      </TouchableOpacity>
    )
  }, [])

  const filteredList = mockedList.filter((item) => {
    const title = `${item.FirstName} ${item.LastName}`
    return title.toLowerCase().includes(input.toLowerCase())
  })

  return <View style={styles.screenContainer}>
    <View style={styles.header}>
      {renderTabs()}
      <Text style={styles.subTitle}>Select a User Account</Text>
      <View>
        <TextInput
          value={input}
          style={styles.input}
          placeholder='Search User'
          placeholderTextColor={colors.grayDark2}
          onChangeText={onChangeText}
        />
        <View
          style={styles.searchWrapper}
        >
          <SearchIcon color={colors.black} width={20} height={20} />
        </View>
        <View>
          {/* {filterIcon button here in v2} */}
        </View>
      </View>
      <View style={styles.listTitleContainer}>
        <Text style={styles.listTitleText}>
          Employee
        </Text>
        <Text style={styles.listTitleText}>
          Role
        </Text>
      </View>
    </View>
    <FlatList
      data={filteredList}
      renderItem={renderItem}
    />
  </View>
};

const styles = StyleSheet.create({
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
  }
})
