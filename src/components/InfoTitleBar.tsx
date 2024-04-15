import { memo, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';

import { colors, fonts } from '../theme';
import { testIds } from '../helpers';

export enum InfoTitleBarType {
  Primary,
  Secondary,
}

interface Props {
  type?: InfoTitleBarType;
  title?: string | JSX.Element;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const InfoTitleBar = memo(
  ({
    type,
    title,
    containerStyle,
    textStyle,
    testID = 'infoTitleBar',
  }: Props) => {
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

    if (!title) return null;

    return (
      <View
        style={getContainerStyleByType}
        testID={testIds.idContainer(testID)}
      >
        {typeof title === 'string' ? (
          <Text style={getTextStyleByType}>{title}</Text>
        ) : (
          title
        )}
      </View>
    );
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
