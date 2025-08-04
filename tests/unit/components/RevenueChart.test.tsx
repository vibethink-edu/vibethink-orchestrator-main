import React from 'react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { RevenueChart } from '@/shared/components/dashboard/RevenueChart';

// Mock testing utilities without @testing-library
const render = (component: React.ReactElement) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  // Simple mock render
  return { container: div };
};

const screen = {
  getByText: (text: string) => {
    const elements = Array.from(document.querySelectorAll('*'));
    const element = elements.find(el => el.textContent?.includes(text));
    if (!element) throw new Error(`Text "${text}" not found`);
    return element;
  },
  getByTestId: (testId: string) => {
    const element = document.querySelector(`[data-testid="${testId}"]`);
    if (!element) throw new Error(`TestId "${testId}" not found`);
    return element;
  }
};

// Mock del componente Chart para evitar problemas de dependencias
jest.mock('@/shared/components/ui/chart', () => ({
  Chart: ({ data, labels, type, className }: any) => (
    <div data-testid="mock-chart" className={className}>
      <div data-testid="chart-type">{type}</div>
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-labels">{JSON.stringify(labels)}</div>
    </div>
  )
}));

describe('RevenueChart', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  it('renders correctly with title and growth indicator', () => {
    render(<RevenueChart />);
    
    // Check main title
    expect(screen.getByText('Revenue (Last 4 Weeks)')).toBeInTheDocument();
    
    // Check growth indicator
    expect(screen.getByText('+15.8% ↗️')).toBeInTheDocument();
  });

  it('renders the Chart component with correct props', () => {
    render(<RevenueChart />);
    
    const chartElement = screen.getByTestId('mock-chart');
    expect(chartElement).toBeInTheDocument();
    
    // Check chart type
    expect(screen.getByTestId('chart-type')).toHaveTextContent('bar');
    
    // Check chart data (revenue values)
    const chartData = screen.getByTestId('chart-data');
    expect(chartData).toHaveTextContent('[3200,4200,3800,5000]');
    
    // Check chart labels (week names)
    const chartLabels = screen.getByTestId('chart-labels');
    expect(chartLabels).toHaveTextContent('["Week 1","Week 2","Week 3","Week 4"]');
  });

  it('calculates and displays total revenue correctly', () => {
    render(<RevenueChart />);
    
    // Expected total: 3200 + 4200 + 3800 + 5000 = 16200
    expect(screen.getByText('$16,200')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });

  it('has proper styling and structure', () => {
    render(<RevenueChart />);
    
    // Check main container classes
    const container = screen.getByText('Revenue (Last 4 Weeks)').closest('div');
    expect(container).toHaveClass('rounded-xl', 'bg-white', 'dark:bg-neutral-900', 'shadow-sm', 'p-6');
    
    // Check Chart has correct height class
    const chartElement = screen.getByTestId('mock-chart');
    expect(chartElement).toHaveClass('h-48');
  });

  it('displays growth indicator with correct styling', () => {
    render(<RevenueChart />);
    
    const growthIndicator = screen.getByText('+15.8% ↗️');
    expect(growthIndicator).toHaveClass('text-sm', 'text-green-600', 'dark:text-green-400', 'font-semibold');
  });

  it('has proper dark mode support classes', () => {
    render(<RevenueChart />);
    
    const container = screen.getByText('Revenue (Last 4 Weeks)').closest('div');
    expect(container).toHaveClass('dark:bg-neutral-900', 'dark:border-gray-700');
  });

  it('renders summary section with border styling', () => {
    render(<RevenueChart />);
    
    const summarySection = screen.getByText('Total Revenue').closest('div');
    expect(summarySection?.parentElement).toHaveClass('mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700');
  });
});

// Test de integración básica
describe('RevenueChart Integration', () => {
  it('renders without crashing', () => {
    const { container } = render(<RevenueChart />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('maintains data integrity', () => {
    render(<RevenueChart />);
    
    // Los datos deben ser consistentes entre el chart y el total
    const expectedData = [3200, 4200, 3800, 5000];
    const expectedTotal = expectedData.reduce((sum, item) => sum + item, 0);
    
    expect(screen.getByText(`$${expectedTotal.toLocaleString()}`)).toBeInTheDocument();
  });
});