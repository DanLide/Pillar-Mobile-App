import React from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';

import { removeProductsStore } from './stores';

export const RemoveProductsListView = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        Current cabinet is:{' '}
        {removeProductsStore.currentStock?.organizationName || 'None'}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
