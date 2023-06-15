import React, { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleProp, View, ViewStyle } from 'react-native';
import Toast, { ToastActionType } from './Toast';
import { ToastType } from '../contexts';

export interface TooltipProps extends PropsWithChildren {
  /** Component to be rendered as the display container. */
  message: string | JSX.Element;

  /** Function which gets called on closing the tooltip. */
  onClose(): void;

  /** Function which gets called on opening the tooltip. */
  onOpen(): void;

  /** To show the tooltip. */
  visible?: boolean;

  /** Passes style object to tooltip container */
  containerStyle?: StyleProp<ViewStyle>;

  /** Style to be applied on the pointer. */
  pointerStyle?: StyleProp<ViewStyle>;

  /** */
  animationType?: 'fade' | 'none';
}

const Tooltip: React.FC<TooltipProps> = ({
  animationType = 'fade',
  children,
  message,
  visible,
  onClose,
  onOpen,
}) => {
  return (
    <View style={{ position: 'relative' }}>
      <Pressable onPress={onOpen}>{children}</Pressable>
      <Modal
        transparent
        visible={visible}
        onShow={onOpen}
        animationType={animationType}
        style={{ position: 'absolute', top: 5, right: 10 }}
      >
        <Toast
          id="tooltip"
          message={message}
          onDestroy={console.log}
          onHide={onClose}
          open
          type={ToastType.Info}
          actionType={ToastActionType.Close}
        />
      </Modal>
    </View>
  );
};

export default Tooltip;
