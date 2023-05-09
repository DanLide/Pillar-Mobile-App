import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { JobModel } from '../stores/JobsStore';
import { colors, fonts } from '../../../theme';

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
  const handlePress = useCallback(() => onPressItem(item), [item, onPressItem]);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.underlineContainer}>
        <View style={styles.toggle}>
          {selectedId === item.jobId ? <View style={styles.selected} /> : null}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.jobNumber}</Text>
          <Text style={styles.description}>{item.jobDescription}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  underlineContainer: {
    height: 46,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.purpleDark,
    fontFamily: fonts.TT_Bold,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.blackSemiLight,
  },
  toggle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 22,
    borderColor: colors.grayDark,
  },
  selected: {
    width: 16.5,
    height: 16.5,
    borderRadius: 16.5,
    backgroundColor: colors.purple,
  },
});
