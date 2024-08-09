import { Text, View, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { colors } from '../theme';

interface Props {
  title: string;
  textStyles: StyleProp<TextStyle>;
  icon?: JSX.Element;
}

export const ColoredTooltip: React.FC<Props> = ({
  title,
  textStyles,
  icon,
}) => (
  <View
    style={[styles.container, icon && styles.containerWithIcon, textStyles]}
  >
    <Text numberOfLines={1} style={[styles.text, textStyles]}>
      {title}
    </Text>
    {!!icon && <View style={styles.icon}>{icon}</View>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.greenLight,
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 1,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerWithIcon: {
    paddingRight: 6,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: colors.green,
  },
  icon: {
    paddingLeft: 3,
  },
});
