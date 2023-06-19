import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Toast, ToastActionType } from '..';
import { ToastType } from '../../contexts/types';
import { toastColors, colors } from '../../theme';
import { testIds } from '../../helpers';

const mockMessage = 'mockMessage';
const mockId = 'mockId';
const mockOnPress = jest.fn();
const mockOnHide = jest.fn();

const defaultProps = {
  id: mockId,
  message: mockMessage,
  type: ToastType.Info,
  onPress: mockOnPress,
  onDestroy: jest.fn(),
  open: true,
  onHide: mockOnHide,
};

const createComponent = (props = {}) =>
  render(<Toast {...defaultProps} {...props} />);

describe('Toast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render', () => {
    const { getByTestId } = createComponent();
    const container = getByTestId(testIds.idContainer('toast'));
    expect(container).toBeDefined();
  });

  it('render message as string', () => {
    const { getByText } = createComponent();
    const text = getByText(mockMessage);
    expect(text).toBeDefined();
  });

  it('render message as component', () => {
    const MockComponent = <Text>{mockMessage}</Text>;
    const { getByText } = createComponent({ message: MockComponent });
    const text = getByText(mockMessage);
    expect(text).toBeDefined();
  });

  it.each(Object.values(ToastType))(
    'render close action type, call onHand and action style',
    type => {
      const { getByTestId } = createComponent({
        type,
        actionType: ToastActionType.Close,
      });
      const closeIcon = getByTestId(testIds.idCloseIcon('toast'));
      const button = getByTestId(testIds.idButton('toast'));
      act(() => {
        button.props.onClick();
      });
      expect(mockOnHide).toHaveBeenCalled();
      expect(closeIcon).toBeDefined();
      expect(closeIcon.props).toHaveProperty('color', toastColors[type].action);
    },
  );

  it.each(Object.values(ToastType))(
    'render undo action type, call onPress and action style',
    type => {
      const { getByTestId } = createComponent({
        type,
        actionType: ToastActionType.Undo,
      });
      const undoText = getByTestId(testIds.idUndoText('toast'));
      const button = getByTestId(testIds.idButton('toast'));
      act(() => {
        button.props.onClick();
      });
      expect(mockOnPress).toHaveBeenCalledWith(mockId);
      expect(undoText).toBeDefined();
      expect(undoText.props.style[1]).toHaveProperty(
        'color',
        toastColors[type].action,
      );
    },
  );

  it('NOT render action type', () => {
    const { getByTestId } = createComponent();
    const button = getByTestId(testIds.idButton('toast'));
    expect(button.props.children[0]).toBeNull();
  });

  it.each(Object.values(ToastType))(
    'render type icon and container style',
    type => {
      const { getByTestId } = createComponent({ type });
      const container = getByTestId(testIds.idContainer('toast'));
      expect(container.props.children[0].props).toEqual({
        color: colors.blackSemiLight,
        primaryColor: toastColors[type].primary,
        secondaryColor: toastColors[type].secondary,
      });
      expect(container.props.style[1]).toEqual({
        backgroundColor: toastColors[type].secondary,
      });
    },
  );
});
