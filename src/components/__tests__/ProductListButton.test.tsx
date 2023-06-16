import React from 'react';
import { render, act } from '@testing-library/react-native';

import { ProductListButton } from '..';
import { testIds } from '../../helpers';

const mockCount = 10;
const mockStyle = { width: 100 };
const mockNavigation = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockNavigation,
    }),
  };
});

describe('ProductListButton', () => {
  it('render container', () => {
    const { getByTestId } = render(
      <ProductListButton
        containerStyle={{ width: 100 }}
        style={{ width: 100 }}
      />,
    );
    expect(getByTestId(testIds.idContainer('productListButton'))).toBeDefined();
  });

  it('render button styles', () => {
    const { getByTestId } = render(<ProductListButton style={mockStyle} />);
    const button = getByTestId(testIds.idButton('productListButton'));
    expect(button.props.style).toHaveProperty('width', 100);
  });

  it('call back navigation', () => {
    const { getByTestId } = render(<ProductListButton />);
    const button = getByTestId(testIds.idButton('productListButton'));
    act(() => {
      button.props.onClick();
    });
    expect(mockNavigation).toHaveBeenCalled();
  });

  it('render count', () => {
    const { getByTestId } = render(<ProductListButton count={mockCount} />);
    const count = getByTestId(testIds.idCount('productListButton'));
    expect(count.props.children).toEqual(mockCount);
  });
});
