import { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors, fonts } from 'src/theme';
import { ConnectedWorker } from 'src/theme/svgs';
import { IColors, IFonts } from 'src/types';

const IconsList = {
  worker: ConnectedWorker,
};

interface IProps {
  title: string;
  onPress: () => void;
  leftIconName?: keyof typeof IconsList;
  fontSize?: number;
  color?: keyof typeof colors;
  fontFamily?: keyof typeof fonts;
  style?: StyleProp<ViewStyle>;
}

const hitSlop = {
  top: 8,
  bottom: 8,
  right: 8,
  left: 8,
};

export const TextButton = ({
  onPress,
  title,
  leftIconName,
  color = 'purpleDark',
  fontFamily = 'TT_Bold',
  style,
  fontSize = 13,
}: IProps) => {
  const LeftIcon = useMemo(
    () => (leftIconName ? IconsList[leftIconName] : null),
    [leftIconName],
  );
  return (
    <TouchableOpacity
      style={[styles.baseContainer, style]}
      activeOpacity={0.4}
      hitSlop={hitSlop}
      onPress={onPress}
    >
      {!!LeftIcon && (
        <LeftIcon color={colors.purpleDark} style={styles.leftIcon} />
      )}
      <Text
        style={{
          color: colors[color],
          fontFamily: fonts[fontFamily],
          fontSize,
          lineHeight: fontSize * 1.3,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftIcon: {
    marginRight: 8,
  },
});
