import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  ListRenderItemInfo,
  StyleSheet,
  Text,
} from 'react-native';
import { observer } from 'mobx-react';

import { jobsStore } from '../stores';
import { fetchJobs } from '../../../data/fetchJobs';

import { JobListItem } from './JobsListItem';
import { JobModel } from '../stores/JobsStore';
import { SVGs, colors, fonts } from '../../../theme';
import { Button, ButtonType } from '../../../components';

interface Props {
  selectedId?: number;
  filterValue: string;

  footerComponent?: JSX.Element | null;
  headerComponent?: JSX.Element | null;

  onPressItem: (job: JobModel) => void;
}

export const JobsList: React.FC<Props> = observer(
  ({
    selectedId,
    footerComponent,
    headerComponent,
    filterValue = '',
    onPressItem,
  }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const filteredList = useMemo(
      () =>
        jobsStore.jobs.filter(job =>
          job.jobNumber.toLowerCase().includes(filterValue.toLowerCase()),
        ),
      [filterValue],
    );

    const renderJobListItem = useCallback(
      ({ item }: ListRenderItemInfo<JobModel>) => (
        <JobListItem
          item={item}
          selectedId={selectedId}
          onPressItem={onPressItem}
        />
      ),
      [onPressItem, selectedId],
    );

    const onFetchJobs = useCallback(async () => {
      setIsLoading(true);
      const error = await fetchJobs(jobsStore);
      setIsLoading(false);

      setIsError(!!error);
    }, []);

    useEffect(() => {
      onFetchJobs();
    }, [onFetchJobs]);

    const keyExtractor = (item: JobModel) => String(item.jobId);

    if (isLoading) {
      return <ActivityIndicator size="large" style={styles.loading} />;
    }

    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <View style={styles.image}>
            <SVGs.JobListErrorIcon />
            <Text style={styles.text}>
              Sorry, the list of jobs are unavailable at the moment
            </Text>
          </View>
          <Button
            type={ButtonType.secondary}
            title="Retry"
            onPress={onFetchJobs}
            buttonStyle={styles.button}
          />
        </View>
      );
    }

    return (
      <>
        {headerComponent}
        <FlatList
          style={styles.container}
          keyExtractor={keyExtractor}
          data={filterValue ? filteredList : jobsStore.jobs}
          renderItem={renderJobListItem}
        />
        {footerComponent}
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    borderTopColor: colors.gray,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray,
  },
  loading: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 76,
    paddingTop: 16,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    color: colors.blackSemiLight,
    textAlign: 'center',
  },
  button: {
    marginHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 16,
  },
});
