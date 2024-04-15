import { render } from '@testing-library/react-native';
import { TextInput } from 'react-native';

import { Input } from '..';
import { Svg } from 'react-native-svg';
import { testIds } from '../../helpers';

const mockContainerStyle = { width: 12 };
const mockInputStyle = { fontSize: 12 };

describe('Input', () => {
  it('render Input with styles', () => {
    const { getByTestId } = render(
      <Input containerStyle={mockContainerStyle} style={mockInputStyle} />,
    );
    const container = getByTestId(testIds.idContainer('input'));
    expect(container.props.style).toEqual([
      {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#CBCBD4',
        borderRadius: 9.5,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 4.5,
        height: 47,
        paddingLeft: 14,
        paddingVertical: 9.5,
      },
      { width: 12 },
    ]);
    expect(container.findByType(TextInput).props.style).toEqual([
      {
        color: '#424247',
        flex: 1,
        fontFamily: '3M Circular TT',
        fontSize: 19,
        lineHeight: 23.5,
      },
      { fontSize: 12 },
    ]);
  });

  it('render right icon', () => {
    const { getByTestId } = render(<Input rightIcon={() => <Svg />} />);
    const container = getByTestId(testIds.idContainer('input'));
    expect(container.findByType(Svg)).toBeDefined();
  });
});
