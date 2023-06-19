import React from 'react';
import { render, act } from '@testing-library/react-native';

import { Checkbox } from '..';
import { testIds } from '../../helpers';

const mockOnChange = jest.fn();

describe('Checkbox', () => {
  it('render checkbox with isChecked true', () => {
    const { getByTestId } = render(
      <Checkbox isChecked onChange={mockOnChange} />,
    );
    const container = getByTestId(testIds.idContainer('checkbox'));
    expect(container.props.style).toEqual({
      alignItems: 'center',
      backgroundColor: '#9657D9',
      borderColor: '#9657D9',
      borderRadius: 26,
      borderWidth: 1,
      height: 26,
      justifyContent: 'center',
      opacity: 1,
      width: 26,
    });

    expect(container.props.children[0]).toBeDefined();
  });

  it('render checkbox with isChecked false', () => {
    const { getByTestId } = render(
      <Checkbox isChecked={false} onChange={mockOnChange} />,
    );
    const container = getByTestId(testIds.idContainer('checkbox'));
    expect(container.props.style).toEqual({
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderColor: '#95959E',
      borderRadius: 26,
      borderWidth: 1,
      height: 26,
      justifyContent: 'center',
      opacity: 1,
      width: 26,
    });

    expect(container.props.children[0]).toBeNull();
  });

  it('should call onChange function', () => {
    const { getByTestId } = render(
      <Checkbox isChecked={false} onChange={mockOnChange} />,
    );
    const container = getByTestId(testIds.idContainer('checkbox'));
    act(() => {
      container.props.onClick();
    });
    expect(mockOnChange).toHaveBeenCalled();
  });
});
