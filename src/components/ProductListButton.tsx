import React, { memo, useCallback, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fonts, SVGs } from '../theme';
import { useNavigation } from '@react-navigation/native';

interface Props extends Omit<TouchableOpacityProps, 'children'> {
  count?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const COUNTER_SIZE = 20;

const ProductListButton: React.FC<Props> = ({
  count,
  containerStyle,
  style,
  ...props
}) => {
  const navigation = useNavigation();

  const buttonStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.button, style],
    [style],
  );

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={containerStyle}>
      <TouchableOpacity style={buttonStyle} onPress={goBack} {...props}>
        <SVGs.ProductListIcon color={colors.purpleDark} />
        <Text style={styles.titleText}>List</Text>
      </TouchableOpacity>
      {count ? (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    padding: 5,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    color: colors.purple,
    fontSize: 20,
    fontFamily: fonts.TT_Regular,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  countContainer: {
    alignItems: 'center',
    backgroundColor: colors.purple,
    borderRadius: COUNTER_SIZE,
    justifyContent: 'center',
    minHeight: COUNTER_SIZE,
    minWidth: COUNTER_SIZE,
    position: 'absolute',
    right: -6,
    top: -10,
  },
  countText: {
    color: colors.white,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 18,
  },
});

export default memo(ProductListButton);