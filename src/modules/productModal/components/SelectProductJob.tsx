import { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { Button, ButtonType } from '../../../components';
import { JobsList } from '../../jobsList/components';
import { JobModel } from '../../jobsList/stores/JobsStore';
import { Tabs } from '../ProductModal';

interface Props {
  isRecoverableProduct?: boolean;
  selectedTab: Tabs;
  productJob?: JobModel;
  isEdit?: boolean;

  onPressBack: () => void;
  onPressSkip: () => void;
  onPressAdd: (job?: JobModel) => void;
}

export const SelectProductJob: React.FC<Props> = ({
  isRecoverableProduct,
  selectedTab,
  productJob,
  isEdit,
  onPressBack,
  onPressSkip,
  onPressAdd,
}) => {
  const [selectedJob, setSelectedJob] = useState<JobModel | undefined>(
    undefined,
  );

  const onPressItem = (job: JobModel) => {
    setSelectedJob(selectedJob?.jobId === job.jobId ? undefined : job);
  };

  useEffect(() => {
    if (selectedTab === Tabs.LinkJob) {
      setSelectedJob(productJob);
    }
  }, [selectedTab, productJob]);

  const Footer = useMemo(
    () => (
      <View style={styles.buttons}>
        {isRecoverableProduct ? (
          <Button
            type={ButtonType.secondary}
            title="Skip"
            buttonStyle={styles.button}
            onPress={onPressSkip}
          />
        ) : (
          <Button
            type={ButtonType.secondary}
            title="Back"
            buttonStyle={styles.button}
            onPress={onPressBack}
          />
        )}
        <Button
          type={ButtonType.primary}
          disabled={isEdit ? false : !selectedJob}
          title="Done"
          buttonStyle={styles.button}
          onPress={() => onPressAdd(selectedJob)}
        />
      </View>
    ),
    [
      isEdit,
      isRecoverableProduct,
      onPressAdd,
      onPressBack,
      onPressSkip,
      selectedJob,
    ],
  );

  if (selectedTab === Tabs.LinkJob) {
    return (
      <JobsList
        selectedId={selectedJob?.jobId}
        onPressItem={onPressItem}
        footerComponent={Footer}
      />
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  header: {
    marginVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  buttons: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between',
  },
  button: {
    width: 163.5,
    height: 48,
  },
});
