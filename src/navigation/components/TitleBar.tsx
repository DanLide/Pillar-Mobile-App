import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '../../theme';
import { isIPod } from 'src/constants';

interface Props {
  title: string;
}

export const TitleBar: React.FC<Props> = ({ title }) => (
  <Text style={styles.title}>{title}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: isIPod ? 15 : 17,
    letterSpacing: isIPod ? -0.1 : 0,
    lineHeight: 26,
    fontFamily: fonts.TT_Bold,
    color: colors.white,
  },
});
