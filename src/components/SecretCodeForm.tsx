import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInputProps,
  View,
  ViewProps,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { SVGs, colors, fonts } from '../theme';
import Button, { ButtonType } from './Button';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  cellCount: number;
  handleConfirm: (shopSetupCode: string) => void;
  autoSubmit?: boolean;
  errorMessage?: string | null;
  confirmDisabled?: boolean;
  isLoading?: boolean;
} & Pick<TextInputProps, 'autoFocus' | 'keyboardType' | 'onChangeText'> &
  Pick<ViewProps, 'style'>;

const SecretCodeForm = ({
  cellCount,
  autoFocus,
  autoSubmit,
  keyboardType,
  errorMessage,
  confirmDisabled,
  isLoading,
  style,
  onChangeText,
  handleConfirm,
}: Props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [enableMask, setEnableMask] = useState(true);
  const ref = useBlurOnFulfill({ value, cellCount: cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: (text: string) => {
      onChangeText?.(text);
      setValue(text);
    },
  });

  const isDisabled = value.length !== cellCount || confirmDisabled;

  const containerStyle = useMemo(() => [styles.container, style], [style]);

  useFocusEffect(
    useCallback(() => {
      if (autoFocus) ref.current?.focus();
    }, [autoFocus, ref]),
  );

  const InputFooter = useMemo(() => {
    if (autoSubmit && isLoading) return <ActivityIndicator />;

    return errorMessage ? (
      <Text style={styles.error}>{errorMessage}</Text>
    ) : null;
  }, [autoSubmit, errorMessage, isLoading]);

  const handleSubmitForm = useCallback(async () => {
    handleConfirm(value);
  }, [handleConfirm, value]);

  const handleChangeText = useCallback(
    (value: string) => {
      setValue(value);

      if (autoSubmit && value.length === cellCount) return handleConfirm(value);
    },
    [autoSubmit, cellCount, handleConfirm],
  );

  const toggleMask = () => setEnableMask(f => !f);

  const renderCell = ({ index, symbol, isFocused }: RenderCellOptions) => {
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
    <View style={containerStyle}>
      <View style={styles.inputContainer}>
        <View style={styles.fieldRow}>
          <CodeField
            autoFocus={autoFocus}
            ref={ref}
            {...props}
            caretHidden={false}
            value={value}
            onChangeText={handleChangeText}
            cellCount={cellCount}
            rootStyle={styles.codeFieldRoot}
            textContentType="oneTimeCode"
            renderCell={renderCell}
            keyboardType={keyboardType}
          />
          <Pressable style={styles.toggle} onPress={toggleMask}>
            {enableMask ? (
              <SVGs.OpenEyeIcon color={colors.grayDark3} />
            ) : (
              <SVGs.CloseEyeIcon color={colors.grayDark3} />
            )}
          </Pressable>
        </View>
        {InputFooter}
      </View>
      {!autoSubmit && (
        <Button
          type={ButtonType.primary}
          title={t('confirm')}
          isLoading={isLoading}
          disabled={isDisabled}
          buttonStyle={styles.buttonStyle}
          onPress={handleSubmitForm}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  error: {
    color: colors.redDark,
    fontFamily: fonts.TT_Bold,
    fontSize: 12,
    lineHeight: 16,
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
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
