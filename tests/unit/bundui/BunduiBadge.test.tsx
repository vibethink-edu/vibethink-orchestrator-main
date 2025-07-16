import React from 'react';
import { render, screen } from '@testing-library/react';
import { BunduiBadge } from '@/app/ui/bundui/components/data-display/BunduiBadge';

describe('BunduiBadge', () => {
  const defaultProps = {
    children: 'Test Badge'
  };

  it('renders correctly with default props', () => {
    render(<BunduiBadge {...defaultProps} />);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    render(<BunduiBadge {...defaultProps} />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('bg-primary');
  });

  it('renders with secondary variant', () => {
    render(<BunduiBadge {...defaultProps} variant="secondary" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('bg-secondary');
  });

  it('renders with destructive variant', () => {
    render(<BunduiBadge {...defaultProps} variant="destructive" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('bg-destructive');
  });

  it('renders with outline variant', () => {
    render(<BunduiBadge {...defaultProps} variant="outline" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('text-foreground');
  });

  it('renders with success variant', () => {
    render(<BunduiBadge {...defaultProps} variant="success" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('bg-green-500');
  });

  it('renders with warning variant', () => {
    render(<BunduiBadge {...defaultProps} variant="warning" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('bg-yellow-500');
  });

  it('renders with small size', () => {
    render(<BunduiBadge {...defaultProps} size="sm" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('px-1.5');
  });

  it('renders with medium size by default', () => {
    render(<BunduiBadge {...defaultProps} />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('px-2.5');
  });

  it('renders with large size', () => {
    render(<BunduiBadge {...defaultProps} size="lg" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('px-3');
  });

  it('applies custom className', () => {
    render(<BunduiBadge {...defaultProps} className="custom-class" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('renders with complex children', () => {
    render(
      <BunduiBadge>
        <span>Icon</span>
        <span>Text</span>
      </BunduiBadge>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('renders as div element', () => {
    render(<BunduiBadge {...defaultProps} />);
    const badge = screen.getByText('Test Badge');
    expect(badge.tagName).toBe('DIV');
  });

  it('has correct base classes', () => {
    render(<BunduiBadge {...defaultProps} />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('rounded-full');
    expect(badge).toHaveClass('border');
  });

  it('combines variant and size classes correctly', () => {
    render(<BunduiBadge {...defaultProps} variant="success" size="lg" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('bg-green-500');
    expect(badge).toHaveClass('px-3');
  });

  it('handles all variant and size combinations', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'];
    const sizes = ['sm', 'md', 'lg'];

    variants.forEach(variant => {
      sizes.forEach(size => {
        const { unmount } = render(
          <BunduiBadge {...defaultProps} variant={variant} size={size} />
        );
        const badge = screen.getByText('Test Badge');
        expect(badge).toBeInTheDocument();
        unmount();
      });
    });
  });
}); 