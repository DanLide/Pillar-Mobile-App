import React, { memo, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fonts } from '../theme';
import { SvgProps } from 'react-native-svg';

interface Props extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: React.NamedExoticComponent<SvgProps> | React.FC<SvgProps>;
}

const Input: React.FC<Props> = ({
  containerStyle,
  rightIcon: RightIcon,
  style,
  ...props
}) => {
  const mergedContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, containerStyle],
    [containerStyle],
  );

  const inputStyle = useMemo<StyleProp<TextStyle>>(
    () => [styles.input, style],
    [style],
  );

  return (
    <View style={mergedContainerStyle}>
      <TextInput
        style={inputStyle}
        placeholderTextColor={colors.grayDark}
        {...props}
      />
      {RightIcon && <RightIcon color={colors.black} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.graySemiLight,
    borderRadius: 9.5,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4.5,
    height: 47,
    paddingHorizontal: 14,
    paddingVertical: 9.5,
  },
  input: {
    flex: 1,
    color: colors.graySemiDark,
    fontFamily: fonts.TT_Regular,
    fontSize: 19,
    lineHeight: 23.5,
  },
});

export default memo(Input);
