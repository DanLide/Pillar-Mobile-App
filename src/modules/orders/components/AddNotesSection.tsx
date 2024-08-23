import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Input } from 'src/components';
import { SVGs, colors, fonts } from 'src/theme';
import { OrdersStore } from '../stores/OrdersStore';
import { observer } from 'mobx-react';
import { isIPod } from 'src/constants';

export const AddNotesSection = observer(
  ({ orderStore }: { orderStore: OrdersStore }) => {
    const { t } = useTranslation();
    const [showNotesInput, setShowNotesInput] = useState(false);
    const presentNotes = () => setShowNotesInput(true);

    useEffect(() => {
      return () => {
        orderStore.setComments('');
      };
    }, [orderStore]);

    return showNotesInput ? (
      <Input
        label={t('notes')}
        containerStyle={styles.notesContainer}
        style={styles.notesInput}
        multiline
        value={orderStore.comments}
        onChangeText={v => orderStore.setComments(v)}
        maxLength={500}
      />
    ) : (
      <TouchableOpacity onPress={presentNotes} style={styles.addNotesContainer}>
        <SVGs.InvoiceIcon />
        <Text style={styles.noteText}>{t('addNotes')}</Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  notesInput: {
    height: '100%',
    fontSize: 13,
    lineHeight: 18,
  },
  notesContainer: {
    height: isIPod ? 64 : 128,
    marginTop: 8,
  },
  addNotesContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    paddingBottom: 0,
  },
  noteText: {
    color: colors.purpleDark3,
    fontFamily: fonts.TT_Bold,
    fontSize: 13,
    lineHeight: 18,
    alignSelf: 'center',
    marginLeft: 8,
  },
});
