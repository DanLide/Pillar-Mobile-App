import { Text, StyleSheet } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardToolbarProps } from 'react-native-keyboard-controller';
import { colors, fonts } from 'src/theme';

export const KeyboardToolButton: KeyboardToolbarProps['button'] = ({
  onPress,
}) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.text}>Done</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.TT_Bold,
    fontSize: 17,
    color: colors.purple,
    marginHorizontal: 8,
  },
});
