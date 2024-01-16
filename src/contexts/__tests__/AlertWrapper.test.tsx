import React from 'react';
import { render, act } from '@testing-library/react-native';

import AlertWrapper from '../AlertWrapper';
import { testIds } from '../../helpers';

const mockPrimaryTitle = 'mockPrimaryTitle';
const mockSecondaryTitle = 'mockSecondaryTitle';
const mockTitle = 'mockTitle';
const mockMessage = 'mockMessage';
const mockOnPressPrimary = jest.fn();
const mockOnPressSecondary = jest.fn();

describe('AlertWrapper', () => {
  it('should render title and message text', () => {
    const { getByText } = render(
      <AlertWrapper
        visible
        title={mockTitle}
        message={mockMessage}
        onPressPrimary={mockOnPressPrimary}
        onPressSecondary={mockOnPressSecondary}
      />
    );
    expect(getByText(mockTitle)).toBeDefined();
    expect(getByText(mockMessage)).toBeDefined();
  });

  it('should call onPressPrimary and onPressSecondary', () => {
    const { getByTestId } = render(
      <AlertWrapper
        visible
        title={mockTitle}
        message={mockMessage}
        onPressPrimary={mockOnPressPrimary}
        onPressSecondary={mockOnPressSecondary}
      />
    );
    const primaryButton = getByTestId(
      testIds.idContainer(testIds.idPrimaryButton('alertWrapper')),
    );
    const secondaryButton = getByTestId(
      testIds.idContainer(testIds.idSecondaryButton('alertWrapper')),
    );
    act(() => {
      primaryButton.props.onClick();
      secondaryButton.props.onClick();
    });
    expect(mockOnPressPrimary).toHaveBeenCalled();
    expect(mockOnPressSecondary).toHaveBeenCalled();
  });

  it('should render primalTitle and secondaryTitle', () => {
    const { getByText } = render(
      <AlertWrapper
        visible
        title={mockTitle}
        message={mockMessage}
        onPressPrimary={mockOnPressPrimary}
        onPressSecondary={mockOnPressSecondary}
        primaryTitle={mockPrimaryTitle}
        secondaryTitle={mockSecondaryTitle}
      />
    );
    expect(getByText(mockPrimaryTitle)).toBeDefined();
    expect(getByText(mockSecondaryTitle)).toBeDefined();
  });
});
