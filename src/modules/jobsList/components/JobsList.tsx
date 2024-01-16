import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { observer } from 'mobx-react';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';

import { jobsStore } from '../stores';
import { fetchJobs } from '../../../data/fetchJobs';

import { JobListItem, JobListItemType } from './JobsListItem';
import { JobModel } from '../stores/JobsStore';
import { SVGs, colors, fonts } from '../../../theme';
import { Button, ButtonType, Input } from '../../../components';
import { CreateJobModal } from 'src/modules/createInvoice/components/CreateJobModal';

interface Props {
  itemType?: JobListItemType;
  selectedId?: number;
  footerComponent?: JSX.Element | null;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  isCreateJobAvailable?: boolean;

  onPressItem: (job: JobModel) => void;
}
const JobsListComponent: React.FC<Props> = observer(
  ({
    selectedId,
    footerComponent,
    itemType = JobListItemType.Toggle,
    containerStyle,
    inputContainerStyle,
    onPressItem,
    isCreateJobAvailable,
  }) => {
    const listRef = useRef<FlatList | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<string>('');
    const [isCreateJobModalVisible, setIsCreateJobModalVisible] =
      useState(false);

    const containerStyles = useMemo(
      () => [styles.container, containerStyle],
      [containerStyle],
    );

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
          type={itemType}
          item={item}
          selectedId={selectedId}
          onPressItem={onPressItem}
        />
      ),
      [itemType, onPressItem, selectedId],
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
    const onChangeText = (text: string) => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
      setFilterValue(text);
    };

    const onCloseModal = (isRefreshJobs?: boolean) => {
      setIsCreateJobModalVisible(false);
      if (isRefreshJobs) {
        onFetchJobs();
      }
    };

    const RenderFooterComponent = memo(() => {
      if (footerComponent) return footerComponent;
      if (isCreateJobAvailable) {
        return (
          <>
            <View style={styles.buttons}>
              <Button
                title="Create Repair Order"
                type={ButtonType.secondary}
                buttonStyle={styles.createJobButton}
                onPress={() => setIsCreateJobModalVisible(true)}
              />
            </View>
            <CreateJobModal
              isVisible={isCreateJobModalVisible}
              onClose={onCloseModal}
            />
          </>
        );
      }
      return null;
    });

    if (isLoading) {
      return <ActivityIndicator size="large" style={styles.loading} />;
    }

    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <View style={styles.image}>
            <SVGs.JobListErrorIcon />
            <Text style={styles.text}>
              Sorry, there was an issue loading a list of open jobs.
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
        <Input
          style={styles.input}
          containerStyle={[styles.inputContainer, inputContainerStyle]}
          value={filterValue}
          placeholder="Search"
          rightIcon={() => (
            <SVGs.SearchIcon color={colors.black} width={16.5} height={16.5} />
          )}
          onChangeText={onChangeText}
          placeholderTextColor={colors.blackSemiLight}
        />
        <FlatList
          style={containerStyles}
          keyExtractor={keyExtractor}
          data={filterValue ? filteredList : jobsStore.jobs}
          renderItem={renderJobListItem}
          ref={listRef}
        />
        <RenderFooterComponent />
      </>
    );
  },
);

export const JobsList = (props: Props) => {
  return (
    <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
      <JobsListComponent {...props} />
    </ToastContextProvider>
  );
};

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
  input: {
    height: 32,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    color: colors.blackSemiLight,
  },
  inputContainer: {
    height: 32,
    marginHorizontal: 16,
    marginTop: 19,
    borderColor: colors.gray,
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
  buttons: { padding: 16, marginTop: 'auto' },
  createJobButton: {
    width: '100%',
  },
});
