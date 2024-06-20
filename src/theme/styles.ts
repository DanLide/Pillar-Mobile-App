import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  flex1: { flex: 1 },
  absolute: { position: 'absolute' },
  moderateShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: -0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
});
