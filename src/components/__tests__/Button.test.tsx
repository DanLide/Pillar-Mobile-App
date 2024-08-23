import { memo } from 'react';
import { render } from '@testing-library/react-native';
import Svg, { SvgProps } from 'react-native-svg';

import { Button, ButtonType } from '..';
import { testIds } from '../../helpers';

const mockTitle = 'mockTitle';
const mockIcon = memo((props: SvgProps) => <Svg {...props} />);

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
    expect(container.props.style).toEqual([
      [
        {
          alignItems: 'center',
          backgroundColor: '#9657D9',
          borderRadius: 8,
          height: 48,
          justifyContent: 'center',
        },
        undefined,
      ],
      undefined,
      undefined,
    ]);
    const title = getByTestId(testIds.idTitle('button'));
    expect(title.props.style).toEqual([
      {
        color: '#FFFFFF',
        fontFamily: '3MCircularTTBold',
        fontSize: 20,
        lineHeight: 30,
      },
      {},
      undefined,
      undefined,
    ]);
  });

  it('render Secondary button type styles', () => {
    const { getByTestId } = render(
      <Button title={mockTitle} type={ButtonType.secondary} />,
    );
    const container = getByTestId(testIds.idContainer('button'));
    expect(container.props.style).toEqual([
      {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#95959E',
        borderRadius: 8,
        borderWidth: 1,
        height: 48,
        justifyContent: 'center',
      },
      undefined,
      undefined,
    ]);
    const title = getByTestId(testIds.idTitle('button'));
    expect(title.props.style).toEqual([
      {
        color: '#FFFFFF',
        fontFamily: '3MCircularTTBold',
        fontSize: 20,
        lineHeight: 30,
      },
      [
        {
          color: '#7634BC',
        },
        undefined,
      ],
      undefined,
      undefined,
    ]);
  });

  it('render button opacity for disabled status', () => {
    const { getByTestId } = render(<Button title={mockTitle} disabled />);
    const container = getByTestId(testIds.idContainer('button'));
    expect(container.props.style[0][1]).toHaveProperty('opacity', 0.5);
  });
});
