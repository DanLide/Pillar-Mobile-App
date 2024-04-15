import AlertWrapper, { AlertWrapperProps } from 'src/contexts/AlertWrapper';

import { View, Text, StyleSheet } from 'react-native';
import { FC } from 'react';
import { fonts } from 'src/theme';

type Props = Omit<AlertWrapperProps, 'message'>;

const EraseProductsAlert: FC<Props> = props => {
  return (
    <AlertWrapper
      title={
        <Text style={[styles.title, styles.label, styles.textBold]}>
          Go Back?
        </Text>
      }
      message={
        <View>
          <Text
            style={[styles.label, { marginBottom: 12, paddingHorizontal: 36 }]}
          >
            If you <Text style={styles.textBold}>go back</Text> now, all
            products added to this list{' '}
            <Text style={styles.textBold}>will be deleted.</Text>
          </Text>

          <Text style={styles.label}>Are you sure you want to continue?</Text>
        </View>
      }
      primaryTitle="Continue"
      secondaryTitle="Cancel"
      {...props}
    />
  );
};

export default EraseProductsAlert;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 15,
    fontFamily: fonts.TT_Regular,
    textAlign: 'center',
  },
  textBold: {
    fontFamily: fonts.TT_Bold,
  },
});
