import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BunduiButton } from '@/app/ui/bundui/components/common/BunduiButton';

describe('BunduiButton', () => {
  const defaultProps = {
    children: 'Test Button'
  };

  it('renders correctly with default props', () => {
    render(<BunduiButton {...defaultProps} />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    render(<BunduiButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('renders with secondary variant', () => {
    render(<BunduiButton {...defaultProps} variant="secondary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('renders with outline variant', () => {
    render(<BunduiButton {...defaultProps} variant="outline" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border');
  });

  it('renders with ghost variant', () => {
    render(<BunduiButton {...defaultProps} variant="ghost" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-accent');
  });

  it('renders with small size', () => {
    render(<BunduiButton {...defaultProps} size="sm" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-8');
  });

  it('renders with medium size by default', () => {
    render(<BunduiButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');
  });

  it('renders with large size', () => {
    render(<BunduiButton {...defaultProps} size="lg" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-12');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<BunduiButton {...defaultProps} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<BunduiButton {...defaultProps} disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<BunduiButton {...defaultProps} className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders with complex children', () => {
    render(
      <BunduiButton>
        <span>Icon</span>
        <span>Text</span>
      </BunduiButton>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
}); 