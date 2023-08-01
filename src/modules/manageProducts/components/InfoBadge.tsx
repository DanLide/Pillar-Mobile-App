import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../../theme';

enum BadgeType {
  Small,
  Medium,
  Large,
}

interface Props {
  subtitle: string;
  title: string;
  type: BadgeType;
}

const InfoBadge = memo(({ type }: Props) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeTitle}>Pieces Per{'\n'} Container</Text>
      <View style={styles.chip}>
        <Text style={styles.chipText}>{product?.unitsPerContainer}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    gap: 8,
  },
  badgeSmall: {
    alignItems: 'center',
    gap: 4,
  },
  badgeSmallTitle: {
    color: colors.grayDark,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 18,
  },
  badgeTitle: {
    color: colors.grayDark2,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 18,
  },
  badgeQuantity: {
    color: colors.black,
    fontFamily: fonts.TT_Bold,
    fontSize: 24,
    lineHeight: 28,
  },
  badgeSubtitle: {
    color: colors.textNeutral,
    fontFamily: fonts.TT_Bold,
    fontSize: 14,
    lineHeight: 18,
  },
  chip: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  chipText: {
    color: colors.black,
    fontFamily: fonts.TT_Bold,
    fontSize: 14,
  },
});
