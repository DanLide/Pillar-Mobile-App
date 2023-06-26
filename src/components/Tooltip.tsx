import React, { PropsWithChildren, useCallback, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import { Toast, ToastActionType } from './Toast';
import { ToastType } from '../contexts/types';

export interface TooltipProps extends PropsWithChildren {
  /** Component to be rendered as the display container. */
  message: string | JSX.Element;

  /** To show the tooltip. */
  visible?: boolean;

  /** Passes style object to tooltip container */
  containerStyle?: StyleProp<ViewStyle>;

  /** Style to be applied on the pointer. */
  pointerStyle?: StyleProp<ViewStyle>;

  /** */
  animationType?: 'fade' | 'none';
}

export const Tooltip: React.FC<TooltipProps> = ({
  animationType = 'fade',
  children,
  message,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const openTooltip = useCallback(() => setIsVisible(true), []);
  const closeTooltip = useCallback(() => setIsVisible(false), []);

  return (
    <View>
      <Pressable onPress={openTooltip}>{children}</Pressable>
      <Modal
        transparent
        visible={isVisible}
        onShow={openTooltip}
        onRequestClose={closeTooltip}
        animationType={animationType}
      >
        <Pressable style={styles.modalOverlay} onPressIn={closeTooltip} />
        <View style={styles.modalContent}>
          <Toast
            id="tooltip"
            message={message}
            onDestroy={console.log}
            onHide={closeTooltip}
            open
            type={ToastType.Info}
            actionType={ToastActionType.Close}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 10,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
