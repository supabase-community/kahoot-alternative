import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

// Mock CSS modules and global CSS imports
jest.mock('../../globals.css', () => ({}));

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mocked-inter-font',
  }),
}));

// Mock next/link since it's a client-side component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Host Dashboard Layout', () => {
  const mockChildren = <div data-testid="children-content">Test Content</div>;

  beforeEach(() => {
    // Clear any previous mocks
    jest.clearAllMocks();
  });

  it('renders header with correct title', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    expect(screen.getByText('SupaQuiz')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveClass('h-16', 'px-2', 'flex', 'justify-between', 'border-b', 'border-gray-200', 'items-center');
  });

  it('renders navigation menu items correctly', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    // Check that both menu items are present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('How to Play')).toBeInTheDocument();

    // Check that menu items link to correct routes
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/host/dashboard');
    expect(screen.getByRole('link', { name: 'How to Play' })).toHaveAttribute('href', '/host/dashboard/how-to');

    // Check that nav element has correct classes
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('border-r', 'border-r-gray-200');
  });

  it('renders children content inside main element', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const childrenContent = screen.getByTestId('children-content');
    expect(childrenContent).toBeInTheDocument();
    expect(childrenContent).toHaveTextContent('Test Content');

    // Check that main element has correct classes
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('flex-grow', 'p-2');
  });

  it('renders SVG icons for menu items', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    // SVG elements don't have an implicit role, so we'll select them by tag
    const svgIcons = document.querySelectorAll('svg');

    expect(svgIcons.length).toBe(2); // Two menu items, two icons

    // Check that each menu item contains an SVG
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const howToPlayLink = screen.getByRole('link', { name: 'How to Play' });

    expect(homeLink.querySelector('svg')).toBeInTheDocument();
    expect(howToPlayLink.querySelector('svg')).toBeInTheDocument();
  });

  it('has proper accessibility landmarks', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    // Check for header landmark
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // Check for navigation landmark
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    // Check for main content landmark
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('applies correct CSS classes for layout structure', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    // Check for the flex container div
    const flexDiv = document.querySelector('.flex');
    expect(flexDiv).toBeInTheDocument();

    // Check that main has flex-grow class indicating responsive layout
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('flex-grow');

    // Check that nav element has the expected border class
    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveClass('border-r', 'border-r-gray-200');
  });

  it('renders with empty children prop', () => {
    render(<RootLayout>{null}</RootLayout>);

    // Should still render the layout structure even with no children
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('preserves the metadata title in the header', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    // The header should show 'SupaQuiz' which matches the metadata title
    const header = screen.getByRole('banner');
    expect(header).toHaveTextContent(/SupaQuiz/);
  });
});