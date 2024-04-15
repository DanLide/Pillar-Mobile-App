import { memo, useCallback, useMemo } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { SSOModel } from '../stores/SelectSSOStore';
import { colors, fonts, SVGs } from '../../../theme';

interface Props {
  item: SSOModel;
  isSelected?: boolean;
  onPressItem?: (item: SSOModel) => void;
}

const SSOListItem: React.FC<Props> = ({ item, isSelected, onPressItem }) => {
  const { address, name } = item;

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, isSelected && styles.selectedContainer],
    [isSelected],
  );

  const handlePress = useCallback<(event: GestureResponderEvent) => void>(
    () => onPressItem?.(item),
    [item, onPressItem],
  );

  return (
    <Pressable style={containerStyle} onPress={handlePress}>
      <View style={styles.content}>
        <SVGs.StoreIcon color={colors.black} />
        <Text numberOfLines={1} style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.separator} />
          {address ? <Text style={styles.address}>{address}</Text> : null}
        </Text>
      </View>
      <View style={styles.line} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  address: {
    color: colors.grayDark,
    flexShrink: 1,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 18.5,
  },
  container: { backgroundColor: colors.white },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginLeft: 16,
    paddingHorizontal: 6,
    paddingVertical: 13,
  },
  name: {
    color: colors.blackSemiLight,
    fontFamily: fonts.TT_Bold,
    fontSize: 16,
    lineHeight: 23.5,
  },
  selectedContainer: { backgroundColor: colors.purpleLight },
  separator: { width: 8 },
  line: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray,
    marginLeft: 16,
  },
  textContainer: { flexShrink: 1 },
});

export default memo(SSOListItem);
