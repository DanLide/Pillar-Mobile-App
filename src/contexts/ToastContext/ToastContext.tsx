import { PropsWithChildren } from 'react';
import { SafeAreaView, View } from 'react-native';
import { ToastProvider as LibToastProvider } from 'react-native-toast-notifications';
import { Props as ToastProviderProps } from 'react-native-toast-notifications/lib/typescript/toast-container';

import { testIds } from '../../helpers';

import { renderType } from './renderTypes';
import { commonStyles } from 'src/theme';

interface Props extends PropsWithChildren<ToastProviderProps> {
  disableSafeArea?: boolean;
  testID?: string;
}

const OFFSET_DEFAULT = 16;
export const TOAST_OFFSET_ABOVE_SINGLE_BUTTON = 62;
export const MODAL_TOAST_OFFSET_ABOVE_SINGLE_BUTTON = 72;

export const ToastProvider: React.FC<Props> = ({ children }) => {
  return (
    <LibToastProvider
      animationType="zoom-in"
      swipeEnabled={false}
      renderType={renderType}
      offsetBottom={OFFSET_DEFAULT}
    >
      {children}
    </LibToastProvider>
  );
};

/**
 *
 * @deprecated This provider is deprecated, please just use useToastMessage with global context
 */
export const ToastContextProvider: React.FC<Props> = ({
  children,
  offset = 0,
  disableSafeArea,
  testID = 'toastContext',
  ...props
}) => {
  const ContainerComponent = disableSafeArea ? View : SafeAreaView;

  return (
    <ContainerComponent
      testID={testIds.idContainer(testID)}
      style={commonStyles.flex1}
    >
      <View style={commonStyles.flex1}>
        <LibToastProvider
          animationType="zoom-in"
          swipeEnabled={false}
          renderType={renderType}
          offset={OFFSET_DEFAULT + offset}
          {...props}
        >
          {children}
        </LibToastProvider>
      </View>
    </ContainerComponent>
  );
};
