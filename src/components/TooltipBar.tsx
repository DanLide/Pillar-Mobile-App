import React, { memo, useMemo } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

import { colors, fonts } from '../theme';
import { testIds } from '../helpers';

interface Props {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const { width } = Dimensions.get('window');

export const TooltipBar = memo(
  ({ title, containerStyle, textStyle, testID = 'tooltipBar' }: Props) => {
    const containerStyles = useMemo(
      () => [styles.container, containerStyle],
      [containerStyle],
    );
    return (
      <View style={containerStyles} testID={testIds.idContainer(testID)}>
        <Text
          style={[styles.text, textStyle]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {title}
        </Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    margin: 4,
    width: width - 8,
    height: 25,
    backgroundColor: colors.white2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,

    shadowColor: colors.black,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,

    zIndex: 1,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
    paddingHorizontal: 8,
  },
});
