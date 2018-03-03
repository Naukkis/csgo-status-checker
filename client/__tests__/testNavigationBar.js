import React from 'react';
import renderer from 'react-test-renderer';
require('jest-localstorage-mock');
import NavigationBar from '../src/components/NavigationBar';

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
});

it('renders correctly', () => {
  const tree = renderer
    .create(<NavigationBar />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

localStorage.setItem('userID', 'lollolloo');

it('renders correctly with userID', () => {
  const tree = renderer
    .create(<NavigationBar />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});