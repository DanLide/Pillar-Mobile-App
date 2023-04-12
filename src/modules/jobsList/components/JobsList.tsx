import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Alert, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';

import { jobsStore } from '../stores';
import { fetchJobs } from '../../../data/fetchJobs';

import { JobListItem } from './JobsListItem';
import { JobModel } from '../../../data/api/jobsAPI';

interface Props {
  selectedId?: number;
  filterValue: string;

  onPressItem: (job: JobModel) => void;
}

export const JobsList: React.FC<Props> = observer(
  ({ selectedId, filterValue, onPressItem }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

    const filteredList = jobsStore.jobs.filter(job =>
      job.jobNumber.toLowerCase().includes(filterValue.toLowerCase()),
    );

    return (
      <FlatList
        data={filterValue ? filteredList : jobsStore.jobs}
        renderItem={({ item }) => (
          <JobListItem
            item={item}
            selectedId={selectedId}
            onPressItem={onPressItem}
          />
        )}
      />
    );
  },
);
