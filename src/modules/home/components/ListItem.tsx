import { memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors, fonts, SVGs } from '../../../theme';

type ListItem = {
  leftIcon: React.ReactElement;
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled?: boolean;
};

const ListItem = memo(
  ({ leftIcon, title, subtitle, onPress, disabled }: ListItem) => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        disabled={disabled}
      >
        {leftIcon}
        <View style={styles.infoContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <SVGs.ChevronIcon color={colors.purpleDark} />
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,

    paddingLeft: 16,
    paddingRight: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleText: {
    fontFamily: fonts.TT_Bold,
    fontSize: 15,
    color: colors.blackSemiLight,
  },
  subtitleText: {
    color: colors.blackLight,
  },
});

export default ListItem;
