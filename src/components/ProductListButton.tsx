import { memo, useCallback, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { colors, fonts, SVGs } from '../theme';
import { testIds } from '../helpers';

interface Props extends Omit<TouchableOpacityProps, 'children'> {
  count?: number;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
  onPress?: () => void;
  buttonListTitle?: string;
}

const COUNTER_SIZE = 20;

const ProductListButton: React.FC<Props> = ({
  count,
  containerStyle,
  style,
  onPress,
  testID = 'productListButton',
  buttonListTitle,
  ...props
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const buttonStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.button, style],
    [style],
  );

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={containerStyle} testID={testIds.idContainer(testID)}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress || goBack}
        {...props}
        testID={testIds.idButton(testID)}
      >
        <View>
          <SVGs.ProductListIcon color={colors.grayDark3} />
          {!!count && (
            <View style={styles.countContainer}>
              <Text style={styles.countText} testID={testIds.idCount(testID)}>
                {count}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.titleText}>
          {buttonListTitle ? buttonListTitle : t('list')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderColor: colors.purple,
    borderWidth: 1.5,
  },
  titleText: {
    color: colors.grayDark3,
    fontSize: 20,
    fontFamily: fonts.TT_Regular,
    marginLeft: 16,
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
    top: -6,
  },
  countText: {
    color: colors.white,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 18,
  },
});

export default memo(ProductListButton);
