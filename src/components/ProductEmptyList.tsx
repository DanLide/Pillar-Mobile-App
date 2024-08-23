import { memo, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import i18n from 'i18next';
import { colors, fonts, SVGs } from '../theme';

interface Props extends ViewProps {
  title?: string;
  subtitle?: string;
  hideTitle?: boolean;
}

export const ProductEmptyList = memo(
  ({
    title = i18n.t('nothingHere'),
    subtitle = i18n.t('startScanning'),
    hideTitle,
    style,
  }: Props) => {
    const containerStyle = useMemo<StyleProp<ViewStyle>>(
      () => [styles.container, style],
      [style],
    );

    return (
      <View style={containerStyle}>
        {!hideTitle && <Text style={styles.emptyText}>{title}</Text>}
        <SVGs.CodeIcon color={colors.black} style={styles.emptyContainerIcon} />
        <Text style={styles.emptyText}>{subtitle}</Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.125,
  },
  emptyText: {
    fontSize: 17,
    fontFamily: fonts.TT_Bold,
    lineHeight: 25,
    color: colors.black,
  },
  emptyContainerIcon: {
    marginVertical: 8,
  },
});
