import React from 'react';
import { render } from '@testing-library/react-native';

import Loading from '../Loading';

const testID = 'loading';

describe('Loading', () => {
  it('render', () => {
    const { getAllByTestId } = render(<Loading testID={testID} />);
    const loading = getAllByTestId(testID);
    expect(loading).toBeDefined();
  });
});
