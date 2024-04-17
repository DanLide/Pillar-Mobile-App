import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import { useEffect, useState } from 'react';
import { Input } from 'src/components';
import { SVGs, colors, fonts } from 'src/theme';
import { OrdersStore } from '../stores/OrdersStore';
import { observer } from 'mobx-react';

export const AddNotesSection = observer(
  ({ orderStore }: { orderStore: OrdersStore }) => {
    const [showNotesInput, setShowNotesInput] = useState(false);
    const presentNotes = () => setShowNotesInput(true);

    useEffect(() => {
      return () => {
        orderStore.setComments('');
      };
    }, [orderStore]);

    return showNotesInput ? (
      <Input
        label="Notes"
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
        <Text style={styles.noteText}>Add Notes</Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  notesInput: {
    height: '100%',
    fontSize: 16,
    lineHeight: 20,
  },
  notesContainer: {
    height: 128,
    marginHorizontal: 16,
    marginVertical: 24,
    paddingTop: 10,
  },
  addNotesContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: 24,
  },
  noteText: {
    color: colors.purpleDark3,
    fontFamily: fonts.TT_Bold,
    fontSize: 16,
    lineHeight: 20,
    alignSelf: 'center',
    marginLeft: 8,
  },
});
