import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { SVGs, colors } from '../theme';
import Button, { ButtonType } from './Button';

type Props = {
  cellCount: number;
  handleConfirm: (shopSetupCode: string) => void;
};

const SecretCodeForm = ({ cellCount, handleConfirm }: Props) => {
  const [value, setValue] = useState('');
  const [enableMask, setEnableMask] = useState(true);
  const ref = useBlurOnFulfill({ value, cellCount: cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const isDisabled = value.length !== 5;

  const onChangeText = (value: string) => {
    setValue(value);
  };

  const toggleMask = () => setEnableMask(f => !f);

  const handleSubmitForm = () => {
    handleConfirm(value);
  };

  const renderCell = ({ index, symbol, isFocused }) => {
    let textChild = null;

    if (symbol) {
      textChild = enableMask ? '•' : symbol;
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {textChild}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldRow}>
        <CodeField
          ref={ref}
          {...props}
          caretHidden={false}
          value={value}
          onChangeText={onChangeText}
          cellCount={cellCount}
          rootStyle={styles.codeFieldRoot}
          textContentType="oneTimeCode"
          renderCell={renderCell}
        />
        <Pressable style={styles.toggle} onPress={toggleMask}>
          {enableMask ? (
            <SVGs.OpenEyeIcon color={colors.grayDark3} />
          ) : (
            <SVGs.CloseEyeIcon color={colors.grayDark3} />
          )}
        </Pressable>
      </View>
      <Button
        type={ButtonType.primary}
        title="Confirm"
        disabled={isDisabled}
        buttonStyle={styles.buttonStyle}
        onPress={handleSubmitForm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    backgroundColor: colors.purple,
    marginTop: 38,
    marginBottom: 16,
  },
  cell: {
    width: 35,
    height: 40,
    lineHeight: 35,
    fontSize: 20,
    borderRadius: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.neutral30,
    backgroundColor: colors.white,
    color: colors.black,
    overflow: 'hidden',
  },
  codeFieldRoot: {
    width: 239,
  },
  fieldRow: {
    marginTop: 20,
    flexDirection: 'row',
    marginLeft: 8,
  },
  focusCell: {
    borderColor: colors.black,
  },
  toggle: {
    width: 35,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
});

export default SecretCodeForm;
