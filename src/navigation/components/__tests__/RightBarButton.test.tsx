import React from 'react';
import { render, act } from '@testing-library/react-native';

import { authStore } from '../../../stores';
import { RightBarButton } from '../RightBarButton';
import { RightBarType } from '../../types';
import { SVGs } from '../../../theme';
import { testIds } from '../../../helpers';

jest.mock('../../../stores');

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: jest.fn(),
    }),
  };
});

describe('RightBarButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render undefined rightBarButtonType', () => {
    const { getByTestId } = render(<RightBarButton />);
    const button = getByTestId(testIds.idButton('rightBarButton'));
    expect(button.props.children[0]).toBeNull();
    act(() => {
      button.props.onClick();
    });
    expect(authStore.logOut).not.toHaveBeenCalled();
  });

  it('render with RightBarType.Logout', () => {
    const { getByTestId } = render(
      <RightBarButton rightBarButtonType={RightBarType.Logout} />,
    );
    const button = getByTestId(testIds.idButton('rightBarButton'));
    expect(button.findByType(SVGs.LogoutIcon)).toBeDefined();
    act(() => {
      button.props.onClick();
    });
    expect(authStore.logOut).toHaveBeenCalled();
  });
});
