import React from 'react';
import { renderToString } from 'react-dom/server';
import RootLayout from './layout';

// Mock the globals.css import
jest.mock('./globals.css', () => ({}));

// Mock the next/font/google import
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mocked-inter-font' }),
}));

describe('RootLayout', () => {
  const mockChildren = <div>Test Child Content</div>;

  it('renders children within proper HTML structure', () => {
    // Using server-side rendering to properly capture the HTML structure
    const renderedString = renderToString(
      <RootLayout>{mockChildren}</RootLayout>
    );

    // Check that the HTML tag with lang attribute is present
    expect(renderedString).toContain('<html lang="en">');
    
    // Check that children content is present
    expect(renderedString).toContain('Test Child Content');
    
    // Check that body tag is present
    expect(renderedString).toContain('<body');
    expect(renderedString).toContain('</body>');
  });

  it('applies the font class to the body element', () => {
    const renderedString = renderToString(
      <RootLayout>{mockChildren}</RootLayout>
    );

    // Check that the body contains the font class
    expect(renderedString).toContain('class="mocked-inter-font"');
  });

  it('properly structures the HTML document', () => {
    const renderedString = renderToString(
      <RootLayout>{mockChildren}</RootLayout>
    );

    // Verify the structure: html -> body -> children
    const htmlStartIndex = renderedString.indexOf('<html lang="en">');
    const bodyStartIndex = renderedString.indexOf('<body');
    const bodyEndIndex = renderedString.indexOf('</body>');
    const childrenIndex = renderedString.indexOf('Test Child Content');

    // The indices should be in the correct order
    expect(htmlStartIndex).toBeLessThan(bodyStartIndex);
    expect(bodyStartIndex).toBeLessThan(childrenIndex);
    expect(childrenIndex).toBeLessThan(bodyEndIndex);
  });

  it('renders with correct root attributes', () => {
    const renderedString = renderToString(
      <RootLayout>{mockChildren}</RootLayout>
    );

    // Check if lang attribute is properly set
    expect(renderedString).toMatch(/<html\s[^>]*lang="en"/);
  });

  it('renders children content unchanged', () => {
    const specificChild = <span data-testid="test-element">Child Content</span>;
    const renderedString = renderToString(
      <RootLayout>{specificChild}</RootLayout>
    );

    expect(renderedString).toContain('data-testid="test-element"');
    expect(renderedString).toContain('Child Content');
  });
});