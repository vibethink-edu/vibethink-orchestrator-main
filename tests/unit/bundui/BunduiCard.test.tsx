import React from 'react';
import { render, screen } from '@testing-library/react';
import { 
  BunduiCard, 
  BunduiCardHeader, 
  BunduiCardTitle, 
  BunduiCardDescription, 
  BunduiCardContent, 
  BunduiCardFooter 
} from '@/app/ui/bundui/components/common/BunduiCard';

describe('BunduiCard', () => {
  const defaultProps = {
    children: 'Test Card Content'
  };

  it('renders correctly with default props', () => {
    render(<BunduiCard {...defaultProps} />);
    expect(screen.getByText('Test Card Content')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    render(<BunduiCard {...defaultProps} />);
    const card = screen.getByText('Test Card Content').parentElement;
    expect(card).toHaveClass('border-border');
  });

  it('renders with outlined variant', () => {
    render(<BunduiCard {...defaultProps} variant="outlined" />);
    const card = screen.getByText('Test Card Content').parentElement;
    expect(card).toHaveClass('border-2');
  });

  it('renders with elevated variant', () => {
    render(<BunduiCard {...defaultProps} variant="elevated" />);
    const card = screen.getByText('Test Card Content').parentElement;
    expect(card).toHaveClass('shadow-lg');
  });

  it('applies custom className', () => {
    render(<BunduiCard {...defaultProps} className="custom-class" />);
    const card = screen.getByText('Test Card Content').parentElement;
    expect(card).toHaveClass('custom-class');
  });
});

describe('BunduiCardHeader', () => {
  it('renders correctly', () => {
    render(<BunduiCardHeader>Header Content</BunduiCardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<BunduiCardHeader className="custom-header">Header</BunduiCardHeader>);
    const header = screen.getByText('Header').parentElement;
    expect(header).toHaveClass('custom-header');
  });
});

describe('BunduiCardTitle', () => {
  it('renders correctly', () => {
    render(<BunduiCardTitle>Card Title</BunduiCardTitle>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders as h3 element', () => {
    render(<BunduiCardTitle>Card Title</BunduiCardTitle>);
    const title = screen.getByText('Card Title');
    expect(title.tagName).toBe('H3');
  });

  it('applies custom className', () => {
    render(<BunduiCardTitle className="custom-title">Title</BunduiCardTitle>);
    const title = screen.getByText('Title');
    expect(title).toHaveClass('custom-title');
  });
});

describe('BunduiCardDescription', () => {
  it('renders correctly', () => {
    render(<BunduiCardDescription>Card Description</BunduiCardDescription>);
    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });

  it('renders as p element', () => {
    render(<BunduiCardDescription>Card Description</BunduiCardDescription>);
    const description = screen.getByText('Card Description');
    expect(description.tagName).toBe('P');
  });

  it('applies custom className', () => {
    render(<BunduiCardDescription className="custom-desc">Description</BunduiCardDescription>);
    const description = screen.getByText('Description');
    expect(description).toHaveClass('custom-desc');
  });
});

describe('BunduiCardContent', () => {
  it('renders correctly', () => {
    render(<BunduiCardContent>Card Content</BunduiCardContent>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<BunduiCardContent className="custom-content">Content</BunduiCardContent>);
    const content = screen.getByText('Content').parentElement;
    expect(content).toHaveClass('custom-content');
  });
});

describe('BunduiCardFooter', () => {
  it('renders correctly', () => {
    render(<BunduiCardFooter>Card Footer</BunduiCardFooter>);
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<BunduiCardFooter className="custom-footer">Footer</BunduiCardFooter>);
    const footer = screen.getByText('Footer').parentElement;
    expect(footer).toHaveClass('custom-footer');
  });
});

describe('BunduiCard Integration', () => {
  it('renders complete card structure', () => {
    render(
      <BunduiCard>
        <BunduiCardHeader>
          <BunduiCardTitle>Test Title</BunduiCardTitle>
          <BunduiCardDescription>Test Description</BunduiCardDescription>
        </BunduiCardHeader>
        <BunduiCardContent>Test Content</BunduiCardContent>
        <BunduiCardFooter>Test Footer</BunduiCardFooter>
      </BunduiCard>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
  });
}); 