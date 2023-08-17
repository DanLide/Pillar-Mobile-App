import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
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

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  message,
  contentStyle,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [infoIconLayout, setInfoIconLayout] = useState({
    height: 0,
    x: 0,
    y: 0,
  });

  const pickerRef = useRef<View>(null);

  const messageStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.message, { bottom: WINDOW_HEIGHT - infoIconLayout.y }],
    [infoIconLayout.y],
  );

  const mergedContentStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.content, contentStyle],
    [contentStyle],
  );

  const pointerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.pointer,
      {
        bottom: WINDOW_HEIGHT - infoIconLayout.y - 2,
        left: infoIconLayout.x,
      },
    ],
    [infoIconLayout],
  );

  const openTooltip = useCallback(async () => {
    const [x, y, height] = await new Promise<[number, number, number]>(
      resolve =>
        pickerRef.current?.measureInWindow((x, y, width, height) =>
          resolve([x, y, height]),
        ),
    );

    setInfoIconLayout({ x, y, height });
    setIsVisible(true);
  }, []);

  const closeTooltip = useCallback(() => setIsVisible(false), []);

  return (
    <View style={styles.container}>
      <Pressable onPress={openTooltip} style={mergedContentStyle}>
        <View ref={pickerRef}>
          <InfoIcon />
        </View>
        {children}
      </Pressable>
      {isVisible && (
        <Modal transparent animationType="none">
          <TouchableOpacity
            activeOpacity={1}
            style={styles.overlay}
            onPress={closeTooltip}
          >
            <Toast
              id="tooltip"
              message={message}
              onHide={closeTooltip}
              type={ToastType.TooltipInfo}
              actionType={ToastActionType.Close}
              style={messageStyle}
            />
            <View style={pointerStyle} />
          </TouchableOpacity>
        </Modal>
      )}
    </View>
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
    alignSelf: 'center',
    position: 'absolute',
  },
  overlay: {
    height: '100%',
    width: '100%',
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
