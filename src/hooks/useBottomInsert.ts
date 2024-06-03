import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useBottomInsert = ({ extraIndent = 16 }) => {
  const { bottom } = useSafeAreaInsets();
  return bottom || extraIndent;
};
