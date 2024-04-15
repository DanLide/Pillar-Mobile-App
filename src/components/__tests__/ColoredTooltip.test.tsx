import { render } from '@testing-library/react-native';

import { ColoredTooltip } from '..';

const mockTitle = 'mockTitle';
const mockTextStyles = { fontSize: 12 };

describe('ColoredTooltip', () => {
  it('render title', () => {
    const { getByText } = render(
      <ColoredTooltip title={mockTitle} textStyles={mockTextStyles} />,
    );
    const title = getByText(mockTitle);
    expect(title).toBeDefined();
  });

  it('render styles', () => {
    const { getByText } = render(
      <ColoredTooltip title={mockTitle} textStyles={mockTextStyles} />,
    );
    const title = getByText(mockTitle);
    expect(title.props.style[1]).toHaveProperty('fontSize', 12);
  });
});
