import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '../../theme';

type DrawerListButtonProps = {
  title: string;
  icon: React.ReactElement;
  disabled?: boolean;
  subtitle?: string;
  onPress?: () => void;
};

export const DrawerListButton: React.FC<DrawerListButtonProps> = ({
  title,
  icon,
  disabled = true,
  onPress,
  subtitle,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconWrapper}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.infoText} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    marginHorizontal: 13,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderColor: colors.grayDark,
    marginBottom: 10,
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
  iconWrapper: {
    paddingVertical: 13,
  },
  subtitle: {
    marginTop: 6,
    color: colors.blackLight,
  },
});
