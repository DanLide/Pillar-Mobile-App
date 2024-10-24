import { memo, useMemo } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  SwitchProps,
  Text,
  TextStyle,
  Switch as RNSwitch,
} from 'react-native';

import { testIds } from '../helpers';

interface Props extends SwitchProps {
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  testID?: string;
}

const Switch: React.FC<Props> = ({
  value,
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
      testID={testIds.idContainer(testID)}
    >
      {label ? <Text style={mergedLabelStyle}>{label}</Text> : null}
      <RNSwitch value={value} onValueChange={onPress} {...props} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  label: { marginLeft: 8 },
});

export default memo(Switch);
