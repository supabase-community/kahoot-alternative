import React from 'react';
import { render, screen } from '@testing-library/react';
import { useMDXComponents } from './mdx-components';

// Import MDXComponents type from the MDX types
import type { MDXComponents } from 'mdx/types';

describe('MDX Components', () => {
  test('should return default components', () => {
    const components: MDXComponents = {};
    const mdxComponents = useMDXComponents(components);

    expect(mdxComponents).toBeDefined();
    expect(mdxComponents.h1).toBeDefined();
    expect(mdxComponents.h2).toBeDefined();
    expect(mdxComponents.h3).toBeDefined();
    expect(mdxComponents.p).toBeDefined();
    expect(mdxComponents.ul).toBeDefined();
    expect(mdxComponents.ol).toBeDefined();
    expect(mdxComponents.li).toBeDefined();
  });

  test('h1 component should render with correct class names', () => {
    const components: MDXComponents = {};
    const mdxComponents = useMDXComponents(components);
    const H1Component = mdxComponents.h1;

    if (!H1Component) {
      throw new Error('H1Component is undefined');
    }

    const TestH1: React.FC<{ children: React.ReactNode }> = (props) => {
      return React.createElement(H1Component, props);
    };

    // Render the component with test content
    render(<TestH1>Test H1</TestH1>);

    expect(screen.getByText('Test H1')).toBeInTheDocument();
    expect(screen.getByText('Test H1')).toHaveClass('text-2xl');
    expect(screen.getByText('Test H1')).toHaveClass('font-bold');
    expect(screen.getByText('Test H1')).toHaveClass('mb-4');
  });

  test('h2 component should render with correct class names', () => {
    const components: MDXComponents = {};
    const mdxComponents = useMDXComponents(components);
    const H2Component = mdxComponents.h2;

    if (!H2Component) {
      throw new Error('H2Component is undefined');
    }

    const TestH2: React.FC<{ children: React.ReactNode }> = (props) => {
      return React.createElement(H2Component, props);
    };

    render(<TestH2>Test H2</TestH2>);

    expect(screen.getByText('Test H2')).toBeInTheDocument();
    expect(screen.getByText('Test H2')).toHaveClass('text-xl');
    expect(screen.getByText('Test H2')).toHaveClass('font-bold');
    expect(screen.getByText('Test H2')).toHaveClass('my-4');
  });

  test('h3 component should render with correct class names', () => {
    const components: MDXComponents = {};
    const mdxComponents = useMDXComponents(components);
    const H3Component = mdxComponents.h3;

    if (!H3Component) {
      throw new Error('H3Component is undefined');
    }

    const TestH3: React.FC<{ children: React.ReactNode }> = (props) => {
      return React.createElement(H3Component, props);
    };

    render(<TestH3>Test H3</TestH3>);

    expect(screen.getByText('Test H3')).toBeInTheDocument();
    expect(screen.getByText('Test H3')).toHaveClass('text-lg');
    expect(screen.getByText('Test H3')).toHaveClass('my-2');
  });

  test('p component should render with correct class names', () => {
    const components: MDXComponents = {};
    const mdxComponents = useMDXComponents(components);
    const PComponent = mdxComponents.p;

    if (!PComponent) {
      throw new Error('PComponent is undefined');
    }

    const TestP: React.FC<{ children: React.ReactNode }> = (props) => {
      return React.createElement(PComponent, props);
    };

    render(<TestP>Test Paragraph</TestP>);

    expect(screen.getByText('Test Paragraph')).toBeInTheDocument();
    expect(screen.getByText('Test Paragraph')).toHaveClass('mb-2');
  });

  test('ul component should render with correct class names', () => {
    const components: MDXComponents = {};
    const mdxComponents = useMDXComponents(components);
    const UlComponent = mdxComponents.ul;

    if (!UlComponent) {
      throw new Error('UlComponent is undefined');
    }

    const TestUL: React.FC<{ children: React.ReactNode }> = (props) => {
      return React.createElement(UlComponent, props);
    };

    render(<TestUL><li>Item 1</li></TestUL>);

    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
    expect(listElement).toHaveClass('list-disc');
    expect(listElement).toHaveClass('pl-6');
    expect(listElement).toHaveClass('mb-2');
  });

  test('ol component should render with correct class names', () => {
    const components: MDXComponents = {};
    const mdxComponents = useMDXComponents(components);
    const OlComponent = mdxComponents.ol;

    if (!OlComponent) {
      throw new Error('OlComponent is undefined');
    }

    const TestOL: React.FC<{ children: React.ReactNode }> = (props) => {
      return React.createElement(OlComponent, props);
    };

    render(<TestOL><li>Item 1</li></TestOL>);

    const orderedList = screen.getByRole('list');
    expect(orderedList).toBeInTheDocument();
    expect(orderedList).toHaveClass('list-decimal');
    expect(orderedList).toHaveClass('pl-6');
    expect(orderedList).toHaveClass('mb-2');
  });

  test('li component should render with correct class names', () => {
    const components: MDXComponents = {};
    const mdxComponents = useMDXComponents(components);
    const LiComponent = mdxComponents.li;

    if (!LiComponent) {
      throw new Error('LiComponent is undefined');
    }

    const TestLI: React.FC<{ children: React.ReactNode }> = (props) => {
      return React.createElement(LiComponent, props);
    };

    render(<TestLI>Test List Item</TestLI>);

    expect(screen.getByText('Test List Item')).toBeInTheDocument();
    expect(screen.getByText('Test List Item')).toHaveClass('mb-1');
  });

  test('should merge custom components with default components', () => {
    const customComponents: MDXComponents = {
      strong: (props: { children?: React.ReactNode }) => <strong className="font-bold">{props.children}</strong>
    };

    const mdxComponents = useMDXComponents(customComponents);

    // Check that default components are still present
    expect(mdxComponents.h1).toBeDefined();
    expect(mdxComponents.h2).toBeDefined();
    expect(mdxComponents.h3).toBeDefined();
    expect(mdxComponents.p).toBeDefined();
    expect(mdxComponents.ul).toBeDefined();
    expect(mdxComponents.ol).toBeDefined();
    expect(mdxComponents.li).toBeDefined();

    // Check that custom component is preserved
    expect(mdxComponents.strong).toBeDefined();
  });

  test('custom components should take precedence when merged', () => {
    const customComponents: MDXComponents = {
      p: (props: { children?: React.ReactNode }) => <p className="custom-paragraph">{props.children}</p>
    };

    const mdxComponents = useMDXComponents(customComponents);
    const PComponent = mdxComponents.p;

    if (!PComponent) {
      throw new Error('PComponent is undefined');
    }

    const TestP: React.FC<{ children: React.ReactNode }> = (props) => {
      return React.createElement(PComponent, props);
    };

    render(<TestP>Custom paragraph</TestP>);

    expect(screen.getByText('Custom paragraph')).toBeInTheDocument();
    expect(screen.getByText('Custom paragraph')).toHaveClass('custom-paragraph');
    // Custom component should override default classes
    expect(screen.getByText('Custom paragraph')).not.toHaveClass('mb-2');
  });
});