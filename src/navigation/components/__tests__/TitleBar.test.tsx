import React from 'react';
import { render } from '@testing-library/react-native';

import { TitleBar } from '../TitleBar';

const mockTitle = 'mockTitle';

describe('TitleBar', () => {
  it('render title', () => {
    const { getByText } = render(<TitleBar title={mockTitle} />);
    expect(getByText).toBeDefined();
  });
});
