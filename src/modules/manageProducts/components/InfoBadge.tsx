import { memo, useMemo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts } from '../../../theme';
import { isNil } from 'ramda';

export enum BadgeType {
  Small,
  Medium,
  Large,
}

interface Props {
  title: string;
  subtitle?: number | string;
  titleWithNewLine?: string;
  type?: BadgeType;
}

export const InfoBadge = memo(
  ({ type, title, titleWithNewLine, subtitle }: Props) => {
    const containerStyle = useMemo<StyleProp<ViewStyle>>(
      () => (type === BadgeType.Medium ? styles.badgeMedium : styles.badge),
      [type],
    );

    const Subtitle = useMemo<JSX.Element | undefined>(() => {
      if (isNil(subtitle)) return;

      switch (type) {
        case BadgeType.Medium:
          return <Text style={styles.subtitleMedium}>{subtitle}</Text>;
        case BadgeType.Large:
          return <Text style={styles.subtitleLarge}>{subtitle}</Text>;
        default:
          return (
            <View style={styles.chip}>
              <Text style={styles.subtitleSmall}>{subtitle}</Text>
            </View>
          );
      }
    }, [subtitle, type]);

    return (
      <View style={containerStyle}>
        <Text style={styles.title}>
          {title}
          {titleWithNewLine ? `\n${titleWithNewLine}` : null}
        </Text>
        {Subtitle}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    gap: 8,
  },
  badgeMedium: {
    alignItems: 'center',
    gap: 4,
  },
  chip: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  subtitleLarge: {
    color: colors.black,
    fontFamily: fonts.TT_Bold,
    fontSize: 24,
    lineHeight: 28,
  },
  subtitleMedium: {
    color: colors.textNeutral,
    fontFamily: fonts.TT_Bold,
    fontSize: 14,
    lineHeight: 18,
  },
  subtitleSmall: {
    color: colors.black,
    fontFamily: fonts.TT_Bold,
    fontSize: 14,
  },
  title: {
    color: colors.grayDark2,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  titleSmall: {
    color: colors.grayDark,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 18,
  },
});
