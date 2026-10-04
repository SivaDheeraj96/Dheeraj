import React from 'react';
import { render } from '@testing-library/react';
import { Homepage } from './portfolio/homepage/Homepage';

test('renders homepage', () => {
  render(<Homepage />);
});
