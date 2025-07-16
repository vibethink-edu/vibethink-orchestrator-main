import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BunduiInput } from '@/app/ui/bundui/components/forms/BunduiInput';

describe('BunduiInput', () => {
  const defaultProps = {
    placeholder: 'Test placeholder'
  };

  it('renders correctly with default props', () => {
    render(<BunduiInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('renders with text type by default', () => {
    render(<BunduiInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with email type', () => {
    render(<BunduiInput {...defaultProps} type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders with password type', () => {
    render(<BunduiInput {...defaultProps} type="password" />);
    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders with number type', () => {
    render(<BunduiInput {...defaultProps} type="number" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('renders with label', () => {
    render(<BunduiInput {...defaultProps} label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with required label', () => {
    render(<BunduiInput {...defaultProps} label="Test Label" required />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<BunduiInput {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledWith('test value');
  });

  it('displays value correctly', () => {
    render(<BunduiInput {...defaultProps} value="test value" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test value');
  });

  it('is disabled when disabled prop is true', () => {
    render(<BunduiInput {...defaultProps} disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('shows error state when error prop is true', () => {
    render(<BunduiInput {...defaultProps} error />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-destructive');
  });

  it('shows error message when error prop is true', () => {
    render(<BunduiInput {...defaultProps} error />);
    expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<BunduiInput {...defaultProps} className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('renders with tel type', () => {
    render(<BunduiInput {...defaultProps} type="tel" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'tel');
  });

  it('renders with url type', () => {
    render(<BunduiInput {...defaultProps} type="url" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'url');
  });

  it('handles controlled input correctly', () => {
    const { rerender } = render(<BunduiInput {...defaultProps} value="initial" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('initial');

    rerender(<BunduiInput {...defaultProps} value="updated" />);
    expect(input).toHaveValue('updated');
  });

  it('maintains focus when value changes', () => {
    render(<BunduiInput {...defaultProps} value="test" />);
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    expect(input).toHaveFocus();
    
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(input).toHaveFocus();
  });
}); 