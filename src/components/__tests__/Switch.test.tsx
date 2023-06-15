import React from 'react';

import { Switch } from '..';
import { render, act } from '@testing-library/react-native';

const mockLabel = 'mockLabel';
const mockContainerStyle = { width: 100 };
const mockSwitchStyle = { backgroundColor: 'white' };
const mockOnPress = jest.fn();

describe('Switch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('render without label', () => {
    const { getByTestId } = render(<Switch />);
    expect(getByTestId('switch:container').props.children[0][1]).toBeNull();
  });

  it('render label', () => {
    const { getByText } = render(<Switch label={mockLabel} />);
    expect(getByText(mockLabel)).toBeDefined();
  });

  it('render styles', () => {
    const { getByTestId, getByText } = render(
      <Switch
        style={mockContainerStyle}
        labelStyle={mockSwitchStyle}
        label={mockLabel}
      />,
    );
    const container = getByTestId('switch:container');
    expect(container.props.style[1]).toHaveProperty('width', 100);
    expect(getByText(mockLabel).props.style[1]).toHaveProperty(
      'backgroundColor',
      'white',
    );
  });

  it('call onPress for container', () => {
    const { getByTestId } = render(<Switch onPress={mockOnPress} />);
    const container = getByTestId('switch:container');
    act(() => {
      container.props.onClick();
    });
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('call onPress for Switch', () => {
    const { getByTestId } = render(<Switch onPress={mockOnPress} />);
    const container = getByTestId('switch:container');
    act(() => {
      container.props.children[0][0].props.onValueChange();
    });
    expect(mockOnPress).toHaveBeenCalled();
  });
});
