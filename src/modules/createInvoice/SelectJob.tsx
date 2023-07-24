import React, { useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { JobListItemType } from '../jobsList/components/JobsListItem';
import { JobsList } from '../jobsList/components';
import { InfoTitleBar, InfoTitleBarType } from '../../components';
import { createInvoiceStore, CreateInvoiceStore } from './stores';
import { JobModel } from '../jobsList/stores/JobsStore';
import { colors } from '../../theme';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AppNavigator } from '../../navigation/types';

export const SelectJob = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const store = useRef<CreateInvoiceStore>(createInvoiceStore).current;

  useEffect(() => {
    if (isFocused) {
      store.clear();
    }
  }, [isFocused, store]);

  const onSelectJob = (job: JobModel) => {
    store.setCurrentJob(job);
    navigation.navigate(AppNavigator.CreateInvoiceProductsScreen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Secondary}
        title="Select a Job Number"
      />
      <JobsList
        itemType={JobListItemType.Select}
        onPressItem={onSelectJob}
        containerStyle={styles.jobListBackground}
        inputContainerStyle={styles.input}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  jobListBackground: {
    backgroundColor: colors.white,
  },
  input: {
    marginTop: 8,
    backgroundColor: colors.white,
  },
});
