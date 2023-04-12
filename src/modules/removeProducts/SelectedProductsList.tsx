import React from 'react';
import { View, SectionList, Text, StyleSheet } from 'react-native';
import { removeProductsStore } from './stores';
import { observer } from 'mobx-react';

import { ProductJobModel } from './stores/ProductJobStore';
import { jobsStore } from '../jobsList/stores';

interface Section {
  title: string | number;
  data: ProductJobModel[];
}

export const SelectedProductsList = observer(() => {
  const sectionListData = removeProductsStore.products.reduce<Section[]>(
    (acc, item) => {
      if (!item.jobId) {
        const otherItem = acc.find(accItem => accItem.title === 'Other');
        if (otherItem) {
          acc.map(accItem => {
            if (accItem.title === 'Other') {
              accItem.data = [...accItem.data, item];
            }
            return accItem;
          });
          return acc;
        } else {
          return [
            ...acc,
            {
              title: 'Other',
              data: [item],
            },
          ];
        }
      } else {
        const itemIndex = acc.findIndex(
          accItem => +accItem.title === item.jobId,
        );

        if (itemIndex > -1) {
          acc[itemIndex].data = [...acc[itemIndex].data, item];
          return acc;
        } else {
          return [
            ...acc,
            {
              title: item.jobId,
              data: [item],
            },
          ];
        }
      }
    },
    [],
  );
  return (
    <View style={styles.container}>
      {removeProductsStore.products.length ? (
        <SectionList
          sections={sectionListData}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>
              {jobsStore.jobs.find(job => job.jobId === title)?.jobNumber ||
                title}
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
