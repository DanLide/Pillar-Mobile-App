import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonCluster } from 'src/components';
import { JobsList } from '../../jobsList/components';
import { JobModel } from '../../jobsList/stores/JobsStore';
import { Tabs } from '../ProductModal';

interface Props {
  isRecoverableProduct?: boolean;
  selectedTab: Tabs;
  productJob?: JobModel;
  isEdit?: boolean;
  productJobs?: JobModel[];

  onPressBack: () => void;
  onPressSkip: () => void;
  onPressAdd: (job?: JobModel) => void;
  updateJobSelectModal?: (showModal: boolean, number?: string) => void;
}

export const SelectProductJob: React.FC<Props> = ({
  isRecoverableProduct,
  selectedTab,
  productJob,
  isEdit,
  onPressBack,
  onPressSkip,
  onPressAdd,
  productJobs,
  updateJobSelectModal,
}) => {
  const { t } = useTranslation();
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
      <ButtonCluster
        leftTitle={isRecoverableProduct ? t('skip') : t('back')}
        leftOnPress={isRecoverableProduct ? onPressSkip : onPressBack}
        rightTitle={t('done')}
        rightOnPress={() => onPressAdd(selectedJob)}
        rightDisabled={isEdit ? false : !selectedJob}
      />
    ),
    [
      isEdit,
      isRecoverableProduct,
      onPressAdd,
      onPressBack,
      onPressSkip,
      selectedJob,
      t,
    ],
  );

  if (selectedTab === Tabs.LinkJob) {
    return (
      <JobsList
        selectedId={selectedJob?.jobId}
        onPressItem={onPressItem}
        footerComponent={Footer}
        isCreateJobLink
        isJobsWithNoRepairOrder
        productJobs={productJobs}
        updateJobSelectModal={updateJobSelectModal}
      />
    );
  } else {
    return null;
  }
};
