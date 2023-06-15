import React from 'react';

import { ToastMessage } from '..';
import { render } from '@testing-library/react-native';

const mockStyle = { width: 100 };

describe('ToastMessage', () => {
  it('render', () => {
    const { getByTestId } = render(<ToastMessage testID="toastMessage" />);
    const container = getByTestId('toastMessage');
    expect(container).toBeDefined();
  });

  it('render bold style', () => {
    const { getByTestId } = render(<ToastMessage testID="toastMessage" bold />);
    const container = getByTestId('toastMessage');
    expect(container.props.style).toEqual([
      {
        color: '#323237',
        flex: 1,
        fontFamily: '3M Circular TT',
        fontSize: 14,
        lineHeight: 17.5,
        textAlign: 'center',
      },
      { fontFamily: '3MCircularTTBold' },
      undefined,
    ]);
  });

  it('render style from props', () => {
    const { getByTestId } = render(
      <ToastMessage testID="toastMessage" style={mockStyle} />,
    );
    const container = getByTestId('toastMessage');
    expect(container.props.style[2]).toEqual(mockStyle);
  });
});
