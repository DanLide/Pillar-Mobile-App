import React from 'react';
import { View } from 'react-native';
import { render, act } from '@testing-library/react-native';

import { Modal } from '..';

const mockSemiTitle = 'semiTitle';
const mockTopOffset = 100;
const mockOnClose = jest.fn();

describe('Modal', () => {
  it('render when isVisible true', () => {
    const { getByTestId } = render(<Modal isVisible onClose={mockOnClose} />);
    const container = getByTestId('modal:container');
    expect(container.props.visible).toBe(true);
  });

  it('render with offset', () => {
    const { getByTestId } = render(
      <Modal isVisible onClose={mockOnClose} topOffset={mockTopOffset} />,
    );
    const content = getByTestId('modal:content');
    expect(content.props.style[1]).toHaveProperty('marginTop', mockTopOffset);
  });

  it('render child', () => {
    const MockChildComponent = () => <View />;
    const { getByTestId } = render(
      <Modal isVisible onClose={mockOnClose}>
        <MockChildComponent />
      </Modal>,
    );
    const content = getByTestId('modal:content');
    expect(content.findByType(MockChildComponent)).toBeDefined();
  });

  it('render semiTitle', () => {
    const { getByText } = render(
      <Modal isVisible onClose={mockOnClose} semiTitle={mockSemiTitle} />,
    );
    expect(getByText(mockSemiTitle)).toBeDefined();
  });

  it('call onClose', () => {
    const { getByTestId } = render(
      <Modal isVisible onClose={mockOnClose} semiTitle={mockSemiTitle} />,
    );
    const closeButton = getByTestId('modal:close');
    act(() => {
      closeButton.props.onClick();
    });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
