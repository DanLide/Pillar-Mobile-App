import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { Button, Input } from '../../../components';
import { JobsList } from '../../jobsList/components';
import { JobModel } from '../../jobsList/stores/JobsStore';
import { productModalStore } from '../store';

interface Props {
  selectedIndex: number;
  onClose: () => void;
  onPressBack: () => void;
  onPressSkip: () => void;
  onPressAdd: (jobId?: number) => void;
}

const { width } = Dimensions.get('window');

export const SelectProductJob: React.FC<Props> = ({
  onClose,
  onPressBack,
  onPressSkip,
  onPressAdd,
  selectedIndex,
}) => {
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [filterValue, setFilterValue] = useState<string>('');

  const onPressItem = (job: JobModel) => {
    setSelectedId(selectedId === job.jobId ? undefined : job.jobId);
  };

  return (
    <>
      <View style={styles.header}>
        <View style={{ width: 100 }} />
        <Text style={styles.headerTitle}>Add job Number</Text>
        <View style={{ width: 100 }}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ textAlign: 'center' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Input
        style={styles.input}
        value={filterValue}
        onChangeText={text => setFilterValue(text)}
      />
      {selectedIndex === 1 ? (
        <JobsList
          selectedId={selectedId}
          onPressItem={onPressItem}
          filterValue={filterValue}
        />
      ) : null}

      <View style={styles.buttons}>
        {productModalStore.product?.isRecoverable ? (
          <Button
            title="Skip"
            buttonStyle={styles.button}
            onPress={onPressSkip}
          />
        ) : (
          <Button
            title="Back"
            buttonStyle={styles.button}
            onPress={onPressBack}
          />
        )}
        <Button
          disabled={!selectedId}
          title="Add"
          buttonStyle={styles.button}
          onPress={() => onPressAdd(selectedId)}
        />
      </View>
    </>
  );
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
    width: width - 32,
    borderWidth: 1,
    borderRadius: 12,
    height: 42,
    margin: 16,
  },
  buttons: {
    flexDirection: 'row',
    margin: 32,
    justifyContent: 'space-between',
  },
  button: {
    width: width / 2 - 48,
  },
});