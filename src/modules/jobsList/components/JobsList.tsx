import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  FlatList,
  Alert,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native';
import { observer } from 'mobx-react';

import { jobsStore } from '../stores';
import { fetchJobs } from '../../../data/fetchJobs';

import { JobListItem } from './JobsListItem';
import { JobModel } from '../stores/JobsStore';

interface Props {
  selectedId?: number;
  filterValue: string;

  onPressItem: (job: JobModel) => void;
}

export const JobsList: React.FC<Props> = observer(
  ({ selectedId, filterValue = '', onPressItem }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

      if (error)
        return Alert.alert('Error', error.message || 'Loading is Failed!');
    }, []);

    useEffect(() => {
      onFetchJobs();
    }, []);

    if (isLoading) {
      return <ActivityIndicator size="large" />;
    }

    return (
      <FlatList
        data={filterValue ? filteredList : jobsStore.jobs}
        renderItem={renderJobListItem}
      />
    );
  },
);
