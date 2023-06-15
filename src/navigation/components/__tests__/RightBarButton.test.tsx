import React from 'react';
import { render, act } from '@testing-library/react-native';

import { authStore } from '../../../stores';
import { RightBarButton } from '../RightBarButton';
import { RightBarType } from '../../types';
import { SVGs } from '../../../theme';

jest.mock('../../../stores');

describe('RightBarButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render undefined rightBarButtonType', () => {
    const { getByTestId } = render(<RightBarButton />);
    const button = getByTestId('rightBarButton:button');
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
    const button = getByTestId('rightBarButton:button');
    expect(button.findByType(SVGs.LogoutIcon)).toBeDefined();
    act(() => {
      button.props.onClick();
    });
    expect(authStore.logOut).toHaveBeenCalled();
  });
});
