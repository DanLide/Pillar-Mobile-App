import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { Toast, ToastActionType } from './Toast';
import { ToastType } from '../contexts/types';
import { InfoIcon } from '../theme/svgs';
import { colors } from '../theme';

export interface TooltipProps extends PropsWithChildren {
  message: string | JSX.Element;
  contentStyle?: StyleProp<ViewStyle>;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  message,
  contentStyle,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [infoIconLayout, setInfoIconLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const messageStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.message, { bottom: containerHeight - 12 }],
    [containerHeight],
  );

  const mergedContentStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.content, contentStyle],
    [contentStyle],
  );

  const pointerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.pointer,
      { bottom: containerHeight - 16, left: infoIconLayout.x },
    ],
    [containerHeight, infoIconLayout],
  );

  const onContainerLayout = useCallback(
    (event: LayoutChangeEvent) =>
      setContainerHeight(event.nativeEvent.layout.height),
    [],
  );

  const onInfoIconLayout = useCallback(
    (event: LayoutChangeEvent) => setInfoIconLayout(event.nativeEvent.layout),
    [],
  );

  const openTooltip = useCallback(() => setIsVisible(true), []);
  const closeTooltip = useCallback(() => setIsVisible(false), []);

  return (
    <>
      {isVisible && <Pressable style={styles.overlay} onPress={closeTooltip} />}
      <View style={styles.container} onLayout={onContainerLayout}>
        <Pressable onPress={openTooltip} style={mergedContentStyle}>
          <InfoIcon onLayout={onInfoIconLayout} />
          {children}
        </Pressable>
        {isVisible && (
          <>
            <Toast
              id="tooltip"
              message={message}
              onHide={closeTooltip}
              type={ToastType.TooltipInfo}
              actionType={ToastActionType.Close}
              style={messageStyle}
            />
            <View style={pointerStyle} />
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    zIndex: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  pointer: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: colors.transparent,
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.background,
    transform: [{ rotate: '180deg' }],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
