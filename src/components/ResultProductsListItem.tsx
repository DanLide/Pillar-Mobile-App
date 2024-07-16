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
    <View style={styles.nameContainer}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
        {item.name}
      </Text>
      <Text style={styles.description}>{item.nameDetails}</Text>
    </View>
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
  description: {
    color: colors.grayDark4,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
  },
  error: {
    marginRight: 8,
  },
  name: {
    color: colors.textNeutral,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Regular,
  },
  nameContainer: {
    flex: 3,
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
