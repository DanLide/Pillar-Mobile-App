import { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ButtonCluster, Input, KeyboardToolButton, Text } from 'src/components';
import { checkIsExistJob, onCreateJob } from 'src/data/createJob';
import { SVGs, colors, commonStyles, fonts } from 'src/theme';
import { ToastType } from 'src/contexts/types';
import { KeyboardToolbar } from 'react-native-keyboard-controller';
import { AppNavigator, THomeNavScreenProps } from 'src/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToastMessage, useCustomGoBack } from 'src/hooks';

export const CreateJobModalScreen = ({
  navigation: { goBack },
  route: { params },
}: THomeNavScreenProps<AppNavigator.CreateJobModal>) => {
  const { t } = useTranslation();
  const { showToast } = useToastMessage();

  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState('');
  const [comment, setComment] = useState('');

  useCustomGoBack({
    callback: (event, navigation) => {
      params.beforeBack?.();
      navigation.dispatch(event.data.action);
    },
    deps: [],
  });

  const handleError = useCallback(
    (error: string) => {
      showToast(error, {
        type: ToastType.Error,
        offsetType: 'aboveButtons',
      });
      setIsLoading(false);
    },
    [showToast],
  );

  const onCreateRepairOrder = async () => {
    setIsLoading(true);

    const isJobExist = await checkIsExistJob(number);
    if (isJobExist) return handleError(t('orderWithSuchNumberExists'));

    const error = await onCreateJob(number, comment);
    if (error) return handleError(t('somethingWentWrong'));

    setIsLoading(false);
    goBack();
    params.onSubmit(number);
    showToast(t('newJobNumberCreated', { number }), {
      type: ToastType.SuccessCreateJob,
      offsetType: 'aboveButtons',
    });
  };

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={-45}
        behavior={'padding'}
        style={commonStyles.flex1}
      >
        <View style={styles.root}>
          <SafeAreaView edges={{ bottom: 'maximum' }} style={styles.container}>
            <View style={styles.topContainer}>
              <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                <SVGs.CloseIcon color={colors.purpleDark} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{t('createRepairOrder')}</Text>
            </View>
            <Text style={styles.title}>{t('repairOrderTitle')}</Text>
            <Input
              containerStyle={styles.bottom16}
              value={number}
              onChangeText={value => setNumber(value)}
              label={t('number')}
              rightLabel={t('required')}
            />
            <Input
              label={t('description')}
              containerStyle={styles.commentContainer}
              style={styles.comment}
              multiline
              value={comment}
              onChangeText={setComment}
              maxLength={1000}
            />
            <ButtonCluster
              style={styles.bottomButtons}
              leftTitle={t('cancel')}
              leftOnPress={goBack}
              rightTitle={t('create')}
              rightOnPress={onCreateRepairOrder}
              rightDisabled={!number.length}
              rightIsLoading={isLoading}
            />
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
      <KeyboardToolbar button={KeyboardToolButton} showArrows={false} />
    </>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'flex-end',
  },
  topContainer: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    height: 24,
    width: 24,
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 12,
    marginBottom: 16,
  },
  bottom16: {
    marginBottom: 16,
  },
  commentContainer: { height: 160 },
  comment: {
    height: 140,
  },
  bottomButtons: {
    marginTop: 24,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
});
