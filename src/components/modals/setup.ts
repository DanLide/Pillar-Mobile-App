import { createModalStack, ModalStackConfig } from 'react-native-modalfy';
import { EraseProductModal } from './EraseProductModal';
import { IModalStackParamsList } from 'src/types';

const modalConfig: ModalStackConfig = {
  EraseProductModal,
};

const defaultOptions = {
  backdropOpacity: 0.6,
};

export const MODAL_STACK = createModalStack<IModalStackParamsList>(
  modalConfig,
  defaultOptions,
);
