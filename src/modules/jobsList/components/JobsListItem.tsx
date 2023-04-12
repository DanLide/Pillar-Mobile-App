import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { JobModel } from '../../../data/api/jobsAPI';

interface Props {
  item: JobModel;
  selectedId?: number;

  onPressItem: (stock: JobModel) => void;
}

export const JobListItem: React.FC<Props> = ({
  item,
  selectedId,
  onPressItem,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPressItem(item)}
    >
      <View style={styles.underlineContainer}>
        <View style={styles.toggle}>
          {selectedId === item.jobId ? <View style={styles.selected} /> : null}
        </View>

        <Text style={styles.title}>{item.jobNumber}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  underlineContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    margin: 16,
  },
  toggle: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 24,
  },
  selected: {
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: 'black',
  },
});
