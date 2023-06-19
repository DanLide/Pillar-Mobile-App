import React from 'react';
import { render } from '@testing-library/react-native';
import Svg from 'react-native-svg';

import { Button, ButtonType } from '..';
import { testIds } from '../../helpers';

const mockTitle = 'mockTitle';
const mockIcon = <Svg />;

describe('Button', () => {
  it('render Button with title', () => {
    const { getByText } = render(<Button title={mockTitle} />);
    const title = getByText(mockTitle);
    expect(title).toBeDefined();
  });

  it('render Button with Icon', () => {
    const { getByTestId } = render(
      <Button title={mockTitle} icon={mockIcon} />,
    );
    const content = getByTestId(testIds.idContent('button')).findByType(Svg);
    expect(content).toBeDefined();
  });

  it('render loader when isLoading true', () => {
    const { getByTestId } = render(<Button title={mockTitle} isLoading />);
    const loader = getByTestId(testIds.idLoadingIndicator('button'));
    expect(loader).toBeDefined();
  });

  it('render Button with disable state when isLoading true', () => {
    const { getByTestId } = render(<Button title={mockTitle} isLoading />);
    const container = getByTestId(testIds.idContainer('button'));
    expect(container.props.accessibilityState.disabled).toBe(true);
  });

  it('render Button with disable state when isLoading false', () => {
    const { getByTestId, getByText } = render(
      <Button title={mockTitle} disabled />,
    );
    const container = getByTestId(testIds.idContainer('button'));
    const title = getByText(mockTitle);
    expect(container.props.accessibilityState.disabled).toBe(true);
    expect(title.props.disabled).toBe(true);
  });

  it('render Primal button type styles', () => {
    const { getByTestId } = render(
      <Button title={mockTitle} type={ButtonType.primary} />,
    );
    const container = getByTestId(testIds.idContainer('button'));
    expect(container.props.style).toEqual({
      alignItems: 'center',
      backgroundColor: '#9657D9',
      borderRadius: 8,
      height: 50,
      justifyContent: 'center',
      opacity: 1,
    });
    const title = getByTestId(testIds.idTitle('button'));
    expect(title.props.style).toEqual([
      { color: 'white', fontSize: 17 },
      { color: '#FFFFFF', fontFamily: '3MCircularTTBold', fontSize: 23.5 },
      undefined,
    ]);
  });

  it('render Secondary button type styles', () => {
    const { getByTestId } = render(
      <Button title={mockTitle} type={ButtonType.secondary} />,
    );
    const container = getByTestId(testIds.idContainer('button'));
    expect(container.props.style).toEqual({
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderColor: '#95959E',
      borderRadius: 8,
      borderWidth: 1,
      height: 50,
      justifyContent: 'center',
      opacity: 1,
    });
    const title = getByTestId(testIds.idTitle('button'));
    expect(title.props.style).toEqual([
      { color: 'white', fontSize: 17 },
      { color: '#7634BC', fontFamily: '3MCircularTTBold', fontSize: 23.5 },
      undefined,
    ]);
  });

  it('render button opacity for disabled status', () => {
    const { getByTestId } = render(<Button title={mockTitle} disabled />);
    const container = getByTestId(testIds.idContainer('button'));
    expect(container.props.style).toHaveProperty('opacity', 0.2);
  });
});
