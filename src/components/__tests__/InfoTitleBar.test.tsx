import React from 'react';
import { render } from '@testing-library/react-native';

import { InfoTitleBar, InfoTitleBarType } from '..';

const mockTitle = 'mockTitle';

describe('InfoTitleBar', () => {
  it('render title', () => {
    const { getByText } = render(<InfoTitleBar title={mockTitle} />);
    const title = getByText(mockTitle);
    expect(title).toBeDefined();
  });

  it('NOT render title', async () => {
    const { queryByTestId } = render(<InfoTitleBar />);
    const container = queryByTestId('infoTitleBar:container');
    expect(container).toBeNull();
  });

  it('render Primary styles', () => {
    const { getByTestId } = render(
      <InfoTitleBar title={mockTitle} type={InfoTitleBarType.Primary} />,
    );

    const container = getByTestId('infoTitleBar:container');

    expect(container.props.style).toEqual([
      {
        alignItems: 'center',
        backgroundColor: '#DBC2F9',
        borderBottomColor: '#E1E1E8',
        borderBottomWidth: 1,
        justifyContent: 'center',
        padding: 2,
      },
      undefined,
    ]);
  });

  it('render Secondary styles', () => {
    const { getByTestId } = render(
      <InfoTitleBar title={mockTitle} type={InfoTitleBarType.Secondary} />,
    );
    const container = getByTestId('infoTitleBar:container');
    expect(container.props.style).toEqual([
      {
        alignItems: 'center',
        backgroundColor: '#F8F8FA',
        borderBottomColor: '#E1E1E8',
        borderBottomWidth: 1,
        justifyContent: 'center',
        padding: 8,
      },
      undefined,
    ]);
  });
});
