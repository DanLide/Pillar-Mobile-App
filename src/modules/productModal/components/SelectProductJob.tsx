import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { Button, ButtonType, Input } from '../../../components';
import { JobsList } from '../../jobsList/components';
import { JobModel } from '../../jobsList/stores/JobsStore';
import { SVGs, colors, fonts } from '../../../theme';
import { Tabs } from '../ProductModal';

interface Props {
  isRecoverable?: boolean;
  selectedTab: Tabs;

  onPressBack: () => void;
  onPressSkip: () => void;
  onPressAdd: (jobId?: number) => void;
}

export const SelectProductJob: React.FC<Props> = ({
  isRecoverable,
  selectedTab,
  onPressBack,
  onPressSkip,
  onPressAdd,
}) => {
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [filterValue, setFilterValue] = useState<string>('');

  const onPressItem = (job: JobModel) => {
    setSelectedId(selectedId === job.jobId ? undefined : job.jobId);
  };

  const Footer = useMemo(
    () => (
      <View style={styles.buttons}>
        {isRecoverable ? (
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
          disabled={!selectedId}
          title="Done"
          buttonStyle={styles.button}
          onPress={() => onPressAdd(selectedId)}
        />
      </View>
    ),
    [isRecoverable, onPressAdd, onPressBack, onPressSkip, selectedId],
  );

  const Header = useMemo(() => (
    <Input
      style={styles.input}
      containerStyle={styles.inputContainer}
      value={filterValue}
      placeholder="Search"
      rightIcon={() => (
        <SVGs.SearchIcon color={colors.black} width={16.5} height={16.5} />
      )}
      onChangeText={text => setFilterValue(text)}
      placeholderTextColor={colors.blackSemiLight}
    />
  ), [filterValue]);

  if (selectedTab === Tabs.LinkJob) {
    return (
      <JobsList
        selectedId={selectedId}
        onPressItem={onPressItem}
        filterValue={filterValue}
        footerComponent={Footer}
        headerComponent={Header}
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
