import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
  it('renders a main element with the correct classes', () => {
    render(<Home />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-between', 'p-12');
  });

  it('renders the Host Home text inside a styled div', () => {
    render(<Home />);
    
    const hostHomeDiv = screen.getByText('Host Home');
    expect(hostHomeDiv).toBeInTheDocument();
    expect(hostHomeDiv).toHaveClass('m-auto', 'p-8', 'bg-black', 'text-white');
  });

  it('renders the correct nested structure', () => {
    render(<Home />);
    
    // Check if main contains a div child with "Host Home" text
    const mainElement = screen.getByRole('main');
    const hostHomeDiv = screen.getByText('Host Home').closest('div');
    
    // The div with "Host Home" should be within the main element
    expect(mainElement.contains(hostHomeDiv)).toBe(true);
  });
});