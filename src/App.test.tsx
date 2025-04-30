// src/App.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect'; // Import this for the toBeInTheDocument matcher

test('renders learn react link', () => {
  render(<App />);

  // This should work now
});