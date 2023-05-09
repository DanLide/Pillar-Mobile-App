import React, { memo, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';
import { colors, fonts } from '../theme';

interface Props extends TextProps {
  bold?: boolean;
}

export const ToastMessage: React.FC<Props> = ({ bold, style, ...props }) => {
  const textStyle = useMemo<StyleProp<TextStyle>>(
    () => [styles.text, bold && styles.textBold, style],
    [bold, style],
  );

  return (
    <Text
      ellipsizeMode="middle"
      numberOfLines={2}
      style={textStyle}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.blackSemiLight,
    flex: 1,
    fontFamily: fonts.TT_Regular,
    fontSize: 16.5,
    lineHeight: 20.5,
    textAlign: 'center',
  },
  textBold: { fontFamily: fonts.TT_Bold },
});

export default memo(ToastMessage);
