import React from 'react';
import { View } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { SharedValue } from 'react-native-reanimated';

import { Modal } from '..';
import { testIds } from '../../helpers';

const mockSemiTitle = 'semiTitle';
const mockTopOffset: SharedValue<number> = { value: 100 };
const mockOnClose = jest.fn();

describe('Modal', () => {
  it('render when isVisible true', () => {
    const { getByTestId } = render(<Modal isVisible onClose={mockOnClose} />);
    const container = getByTestId(testIds.idContainer('modal'));
    expect(container.props.visible).toBe(true);
  });

  it('render with offset', () => {
    const { getByTestId } = render(
      <Modal isVisible onClose={mockOnClose} topOffset={mockTopOffset} />,
    );
    const content = getByTestId(testIds.idContent('modal'));
    expect(content).toHaveAnimatedStyle({ marginTop: mockTopOffset.value });
  });

  it('render child', () => {
    const MockChildComponent = () => <View />;
    const { getByTestId } = render(
      <Modal isVisible onClose={mockOnClose}>
        <MockChildComponent />
      </Modal>,
    );
    const content = getByTestId(testIds.idContent('modal'));
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
    const closeButton = getByTestId(testIds.idClose('modal'));
    act(() => {
      closeButton.props.onClick();
    });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
