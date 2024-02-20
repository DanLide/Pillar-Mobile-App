import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ButtonType, Input, Modal, Text } from 'src/components';
import { checkIsExistJob, onCreateJob } from 'src/data/createJob';
import { colors, fonts } from 'src/theme';
import { useKeyboard, useSingleToast } from 'src/hooks';
import { ToastType } from 'src/contexts/types';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { DEFAULT_TOP_OFFSET } from 'src/components/Modal';

interface Props {
  isVisible: boolean;
  onClose: (isRefreshJobs?: boolean) => void;
}

export const CreateJobModal = ({ isVisible, onClose }: Props) => {
  const { showToast } = useSingleToast();

  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState('');
  const [comment, setComment] = useState('');

  const handleError = useCallback(
    (error: string) => {
      showToast(error, { type: ToastType.Error });
      onClose(false);
      setIsLoading(false);
    },
    [onClose, showToast],
  );

  const onCreateRepairOrder = async () => {
    setIsLoading(true);

    const isJobExist = await checkIsExistJob(number);
    if (isJobExist)
      return handleError(
        `The Repair order with such ${number} already exists.`,
      );

    const error = await onCreateJob(number, comment);
    if (error) return handleError('Something went wrong. Please, retry');

    setIsLoading(false);
    onClose(true);

    showToast(`New Job Number ${number} is created.`, {
      type: ToastType.SuccessCreateJob,
    });
  };

  useEffect(() => {
    if (isVisible) {
      setNumber('');
      setComment('');
    }
  }, [isVisible]);

  const onCloseModal = () => {
    onClose();
  };

  const topOffset = useSharedValue(DEFAULT_TOP_OFFSET);

  useKeyboard({
    keyboardWillShow: ({ endCoordinates: { height } }) => {
      topOffset.value = withTiming(DEFAULT_TOP_OFFSET - height, {
        duration: 300,
      });
    },
    keyboardWillHide: () => {
      topOffset.value = withTiming(DEFAULT_TOP_OFFSET, { duration: 300 });
    },
  });

  return (
    <Modal
      isVisible={isVisible}
      onClose={onCloseModal}
      semiTitle="Create Repair Order"
      titleStyle={styles.headerTitle}
      topOffset={topOffset}
    >
      <View style={styles.container}>
        <Text style={[styles.title, styles.bottomMargin]}>Repair Order</Text>
        <Input
          placeholder="Number"
          containerStyle={styles.bottomMargin}
          value={number}
          onChangeText={value => setNumber(value)}
          rightLabel="Required"
        />
        <Input
          placeholder="Comments"
          containerStyle={[styles.bottomMargin, styles.commentContainer]}
          style={styles.comment}
          multiline
          value={comment}
          onChangeText={setComment}
          maxLength={1000}
        />
        <View style={styles.buttons}>
          <Button
            title="Cancel"
            type={ButtonType.secondary}
            buttonStyle={styles.button}
            onPress={onCloseModal}
          />
          <Button
            title="Create"
            type={ButtonType.primary}
            buttonStyle={styles.button}
            onPress={onCreateRepairOrder}
            disabled={!number.length}
            isLoading={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 17,
    lineHeight: 20,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark3,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark3,
  },
  bottomMargin: {
    marginBottom: 16,
  },
  commentContainer: { height: 250 },
  comment: {
    height: 230,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: 163.5,
    height: 48,
  },
});
