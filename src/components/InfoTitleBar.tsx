import React, { memo, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { colors, fonts } from '../theme';

export enum InfoTitleBarType {
  Primary,
  Secondary,
}

interface Props {
  type?: InfoTitleBarType;
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const InfoTitleBar = memo(
  ({ type, title, containerStyle, textStyle }: Props) => {
    const getContainerStyleByType = useMemo(() => {
      switch (type) {
        case InfoTitleBarType.Primary:
          return [styles.primaryContainer, containerStyle];
        case InfoTitleBarType.Secondary:
          return [styles.secondaryContainer, containerStyle];
        default:
          return null;
      }
    }, [containerStyle, type]);

    const getTextStyleByType = useMemo(() => {
      switch (type) {
        case InfoTitleBarType.Primary:
          return [styles.primaryText, textStyle];
        case InfoTitleBarType.Secondary:
          return [styles.secondaryText, textStyle];
        default:
          return null;
      }
    }, [textStyle, type]);

    return title ? (
      <View style={getContainerStyleByType}>
        <Text style={getTextStyleByType}>{title}</Text>
      </View>
    ) : null;
  },
);

const styles = StyleSheet.create({
  primaryContainer: {
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    padding: 2,
  },
  secondaryContainer: {
    backgroundColor: colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    padding: 8,
  },
  primaryText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Regular,
    color: colors.blackLight,
    alignSelf: 'center',
  },
  secondaryText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Regular,
    color: colors.blackLight,
    alignSelf: 'center',
  },
});
