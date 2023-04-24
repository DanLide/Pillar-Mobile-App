import React from 'react';
import { View, SectionList, Text, StyleSheet } from 'react-native';
import { removeProductsStore } from './stores';
import { observer } from 'mobx-react';

import { RemoveProductsType } from './stores/RemoveProductsStore';

export const toSectionListData = (value: RemoveProductsType) =>
  Object.keys(value).map(key => ({ title: key, data: value[key] }));

export const SelectedProductsList = observer(() => {
  const sectionListData = toSectionListData(removeProductsStore.products);

  return (
    <View style={styles.container}>
      {sectionListData.length ? (
        <SectionList
          sections={sectionListData}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>
              {title === '-1' ? 'Other' : title}
            </Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCount}>{item.reservedCount}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.text}>
          To begin scanning products, simply tap on the camera button below.
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  sectionTitle: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#D3D3D3',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 12,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemCount: {
    fontSize: 14,
  },
});
