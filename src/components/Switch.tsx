import React, { memo, useMemo } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  SwitchProps,
  Text,
  TextStyle,
  Switch as RNSwitch,
} from 'react-native';

interface Props extends SwitchProps {
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  testID?: string;
}

const Switch: React.FC<Props> = ({
  label,
  style,
  labelStyle,
  onPress,
  testID = 'switch',
  ...props
}) => {
  const containerStyle = useMemo(() => [styles.container, style], [style]);

  const mergedLabelStyle = useMemo(
    () => [styles.label, labelStyle],
    [labelStyle],
  );

  return (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      testID={`${testID}:container`}
    >
      <RNSwitch onValueChange={onPress} {...props} />
      {label ? <Text style={mergedLabelStyle}>{label}</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  label: { marginLeft: 8 },
});

export default memo(Switch);
