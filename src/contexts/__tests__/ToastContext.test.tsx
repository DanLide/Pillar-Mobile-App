import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ToastProvider } from 'react-native-toast-notifications';

import { testIds } from '../../helpers';
import { ToastContextProvider } from '../ToastContext/ToastContext';

const mockChildrenText = 'mockChildrenText';
const mockOffset = 16;

describe('ToastContext', () => {
  it('render children', () => {
    const { getByText } = render(
      <ToastContextProvider>
        <Text>{mockChildrenText}</Text>
      </ToastContextProvider>,
    );
    expect(getByText(mockChildrenText)).toBeDefined();
  });

  it('render offset', () => {
    const { getByTestId } = render(
      <ToastContextProvider offset={mockOffset}>
        <Text>{mockChildrenText}</Text>
      </ToastContextProvider>,
    );
    const container = getByTestId(testIds.idContainer('toastContext'));
    expect(container.findByType(ToastProvider).props.offset).toEqual(
      mockOffset + 16,
    );
  });
});
