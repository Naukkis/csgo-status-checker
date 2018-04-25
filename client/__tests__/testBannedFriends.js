import React from 'react';
import renderer from 'react-test-renderer';
import BannedFriends from '../src/components/BannedFriends';

it('renders correctly', () => {
  const tree = renderer
    .create(<BannedFriends bannedFriends={12} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
