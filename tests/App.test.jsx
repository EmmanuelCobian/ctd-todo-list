import { describe, expect, it } from 'vitest';
import App from '../src/App';
import { render, screen } from '@testing-library/react';

describe('App test suite', () => {
  it('contains a `h1` html element', () => {
    render(<App />)
    expect(screen.getByRole('heading')).toBeInTheDocument();
    screen.debug()
  })
});