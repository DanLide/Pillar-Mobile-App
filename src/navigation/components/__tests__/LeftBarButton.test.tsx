import { render, act } from '@testing-library/react-native';

import { LeftBarButton } from '../LeftBarButton';
import { LeftBarType } from '../../types';
import { SVGs } from '../../../theme';
import { testIds } from '../../../helpers';

const mockNavigation = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockNavigation,
      canGoBack: () => true,
    }),
  };
});

describe('LeftBarButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render with undefined', () => {
    const { getByTestId } = render(<LeftBarButton />);
    const button = getByTestId(testIds.idButton('leftBarButton'));
    expect(button.props.children[0]).toBeNull();
    act(() => {
      button.props.onClick();
    });
    expect(mockNavigation).not.toHaveBeenCalled();
  });

  it('render with LeftBarType.Back', () => {
    const { getByTestId } = render(
      <LeftBarButton leftBarButtonType={LeftBarType.Back} />,
    );
    const button = getByTestId(testIds.idButton('leftBarButton'));
    expect(button.findByType(SVGs.ChevronIcon)).toBeDefined();
    act(() => {
      button.props.onClick();
    });
    expect(mockNavigation).toHaveBeenCalled();
  });

  it('render with LeftBarType.Close', () => {
    const { getByTestId } = render(
      <LeftBarButton leftBarButtonType={LeftBarType.Close} />,
    );
    const button = getByTestId(testIds.idButton('leftBarButton'));
    expect(button.findByType(SVGs.CloseIcon)).toBeDefined();
    act(() => {
      button.props.onClick();
    });
    expect(mockNavigation).toHaveBeenCalled();
  });
});
