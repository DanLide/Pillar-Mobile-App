import { memo } from 'react';
import { View } from 'react-native';

export const Spacer = memo(
  ({ w, h, flex }: { w?: number; h?: number; flex?: number }) => {
    return (
      <View
        style={{
          ...(w && { width: w }),
          ...(h && { height: h }),
          ...(flex && { flex: flex }),
        }}
      />
    );
  },
);
