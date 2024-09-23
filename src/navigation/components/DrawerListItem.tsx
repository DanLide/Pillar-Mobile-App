import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

import { colors, fonts, SVGs } from '../../theme';

type DrawerListItemProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactElement;
  disabled?: boolean;
  onPress?: () => void;
  showChevron?: boolean;
};

export const DrawerListItem: React.FC<DrawerListItemProps> = ({
  title,
  subtitle,
  icon,
  disabled = true,
  onPress,
  showChevron,
}) => {
  return (
    <TouchableOpacity
      style={styles.listContainer}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={styles.itemContainer}>
        {icon}
        <View style={styles.textContainer}>
          <Text style={styles.infoText} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitleText} numberOfLines={3}>
              {subtitle}
            </Text>
          )}
        </View>
        {showChevron && (
          <View style={styles.chevron}>
            <SVGs.ChevronIcon color={colors.purpleDark} />
          </View>
        )}
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  listContainer: {
    paddingLeft: 18,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  infoText: {
    fontSize: 15,
    fontFamily: fonts.TT_Regular,
    color: colors.blackSemiLight,
    fontWeight: '700',
  },
  subtitleText: {
    marginTop: 6,
    color: colors.blackLight,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray,
  },
  chevron: {
    marginLeft: 'auto',
    paddingHorizontal: 15,
  },
});
