
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatInterface } from '../../components/ChatInterface';
import '@testing-library/jest-dom';

// Minimal polyfill
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
}

// Mock DOMPurify
jest.mock('dompurify', () => ({
  sanitize: (val: string) => val
}));

// Mock Lucide icons with a much simpler pattern to avoid Babel issues
jest.mock('lucide-react', () => {
  const React = require('react');
  return new Proxy({}, {
    get: (target, prop) => {
      return () => React.createElement('span', { 'data-testid': `icon-${String(prop)}` });
    }
  });
});

describe('ChatInterface UI Basic Rendering', () => {
  it('renders welcome message successfully', () => {
    render(<ChatInterface />);
    expect(screen.getByText(/How can I help you today\?/i)).toBeInTheDocument();
  });

  it('can type into the main input', () => {
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(/Ask about voting forms, registration\.\.\./i);
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });
});
