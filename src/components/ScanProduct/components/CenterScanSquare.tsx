import { memo } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { WIDTH } from 'src/constants';
import { colors } from 'src/theme';

export const BORDER_WIDTH = 3;

export const CenterScanSquare = memo(
  ({
    onLayoutScanSquare,
    autoScanDone,
  }: {
    onLayoutScanSquare: ({ nativeEvent }: LayoutChangeEvent) => void;
    autoScanDone: boolean;
  }) => (
    <View style={styles.centreSquareWrapper}>
      <View onLayout={onLayoutScanSquare} style={styles.centreSquareContainer}>
        <View
          style={[
            styles.baseScanSquareStyle,
            styles.topLeft,
            autoScanDone && styles.greenBorder,
          ]}
        />
        <View
          style={[
            styles.baseScanSquareStyle,
            styles.topRight,
            autoScanDone && styles.greenBorder,
          ]}
        />
        <View
          style={[
            styles.baseScanSquareStyle,
            styles.bottomRight,
            autoScanDone && styles.greenBorder,
          ]}
        />
        <View
          style={[
            styles.baseScanSquareStyle,
            styles.bottomLeft,
            autoScanDone && styles.greenBorder,
          ]}
        />
      </View>
    </View>
  ),
);

const styles = StyleSheet.create({
  centreSquareWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centreSquareContainer: {
    aspectRatio: 1,
    width: WIDTH / 2,
    height: WIDTH / 2,
    position: 'absolute',
    alignSelf: 'center',
  },
  baseScanSquareStyle: {
    position: 'absolute',
    height: 48,
    width: 48,
    borderColor: colors.white,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderBottomLeftRadius: 25,
  },
  bottomRight: {
    bottom: 0,
    right: 0,

    borderBottomWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderBottomRightRadius: 25,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderColor: colors.white,
    borderTopWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderTopLeftRadius: 25,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderTopRightRadius: 25,
  },
  greenBorder: {
    borderColor: colors.green5,
  },
});
