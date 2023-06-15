import React from 'react';
import { render } from '@testing-library/react-native';

import { TooltipBar } from '..';

const mockTitle = 'mockTitle';
const mockContainerStyle = { width: 10 };
const mockTextStyle = { fontSize: 12 };

describe('TooltipBar', () => {
  it('render title', () => {
    const { getByText } = render(<TooltipBar title={mockTitle} />);
    const title = getByText(mockTitle);
    expect(title).toBeDefined();
  });

  it('render styles', () => {
    const { getByTestId, getByText } = render(
      <TooltipBar
        title={mockTitle}
        containerStyle={mockContainerStyle}
        textStyle={mockTextStyle}
      />,
    );
    const container = getByTestId('tooltipBar:container');
    expect(container.props.style).toEqual([
      {
        alignItems: 'center',
        backgroundColor: '#F6EFFE',
        borderRadius: 5,
        height: 25,
        justifyContent: 'center',
        margin: 4,
        shadowColor: '#000000',
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        width: 742,
        zIndex: 1,
      },
      { width: 10 },
    ]);
    const text = getByText(mockTitle);
    expect(text.props.style).toEqual([
      {
        color: '#000000',
        fontFamily: '3M Circular TT',
        fontSize: 14,
        paddingHorizontal: 8,
      },
      { fontSize: 12 },
    ]);
  });
});
