import { memo } from 'react';
import { colors, fonts, SVGs } from '../theme';
import { StyleSheet, Text, View } from 'react-native';
import { ProductModel } from '../stores/types';

interface Props {
  item: ProductModel;
}

export const ResultProductsListItem = memo(({ item }: Props) => (
  <View style={styles.container}>
    {item.isRemoved ? null : (
      <SVGs.ExclamationMarkIcon color={colors.red} style={styles.error} />
    )}
    <Text numberOfLines={1} ellipsizeMode="middle" style={styles.name}>
      {item.name}
    </Text>
    <Text style={styles.reservedCount}>{item.reservedCount}</Text>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginLeft: 16,
    paddingVertical: 8,
  },
  error: {
    marginRight: 8,
  },
  name: {
    flex: 3,
    color: colors.blackSemiLight,
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.TT_Regular,
  },
  reservedCount: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'right',
    color: colors.blackSemiLight,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    paddingRight: 30,
  },
});
