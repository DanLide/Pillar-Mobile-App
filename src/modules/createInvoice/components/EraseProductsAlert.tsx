import AlertWrapper, { AlertWrapperProps } from 'src/contexts/AlertWrapper';

import { View, Text, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import { fonts } from 'src/theme';

type Props = Omit<AlertWrapperProps, 'message'>;

const EraseProductsAlert: FC<Props> = props => {
  return (
    <AlertWrapper
      title={
        <Text style={[styles.title, styles.textBold, styles.label]}>
          Go Back?
        </Text>
      }
      message={
        <View style={styles.messageContainer}>
          <Text style={(styles.label, { marginBottom: 12 })}>
            If you <Text style={styles.textBold}>go back</Text> now, all
            products added to this list{' '}
            <Text style={styles.textBold}>will be deleted.</Text>
          </Text>

          <Text>Are you sure you want to continue?</Text>
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
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontFamily: fonts.TT_Regular,
    fontWeight: '700',
  },
  textBold: {
    fontFamily: fonts.TT_Bold,
  },
  messageContainer: {
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
