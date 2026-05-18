import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Component', () => {
  it('should render the admin heading', () => {
    render(<Home />);

    const headingElement = screen.getByRole('heading', {
      name: /admin/i
    });

    expect(headingElement).toBeTruthy();
    expect(headingElement.tagName).toBe('H1');
  });

  it('renders without crashing', () => {
    expect(() => {
      render(<Home />);
    }).not.toThrow();
  });

  it('has correct structure', () => {
    const { container } = render(<Home />);

    // Check that the component renders an H1 element with "Admin" text
    const h1Element = container.querySelector('h1');
    expect(h1Element).toBeTruthy();
    expect(h1Element?.textContent).toBe('Admin');
  });
});