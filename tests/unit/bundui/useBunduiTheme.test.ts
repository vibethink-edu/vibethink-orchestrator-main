import { renderHook, act } from '@testing-library/react';
import { useBunduiTheme } from '@/app/ui/bundui/hooks/useBunduiTheme';

// Mock document.documentElement
const mockDocumentElement = {
  style: {
    setProperty: jest.fn()
  }
};

Object.defineProperty(document, 'documentElement', {
  value: mockDocumentElement,
  writable: true
});

describe('useBunduiTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default theme', () => {
    const { result } = renderHook(() => useBunduiTheme());
    
    expect(result.current.currentTheme.name).toBe('vibethink-default');
    expect(result.current.currentTheme.primaryColor).toBe('#3b82f6');
  });

  it('initializes with custom theme', () => {
    const { result } = renderHook(() => useBunduiTheme('bundui-light'));
    
    expect(result.current.currentTheme.name).toBe('bundui-light');
    expect(result.current.currentTheme.primaryColor).toBe('#10b981');
  });

  it('provides all available themes', () => {
    const { result } = renderHook(() => useBunduiTheme());
    
    expect(result.current.availableThemes).toHaveLength(4);
    expect(result.current.availableThemes.map(t => t.name)).toEqual([
      'vibethink-default',
      'bundui-light',
      'enterprise-blue',
      'modern-dark'
    ]);
  });

  it('changes theme when changeTheme is called', () => {
    const { result } = renderHook(() => useBunduiTheme());
    
    act(() => {
      result.current.changeTheme('bundui-light');
    });
    
    expect(result.current.currentTheme.name).toBe('bundui-light');
  });

  it('applies theme to CSS when theme changes', () => {
    const { result } = renderHook(() => useBunduiTheme());
    
    act(() => {
      result.current.changeTheme('enterprise-blue');
    });
    
    expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
      '--primary-color',
      '#1e40af'
    );
    expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
      '--secondary-color',
      '#475569'
    );
    expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
      '--background-color',
      '#f8fafc'
    );
    expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
      '--text-color',
      '#0f172a'
    );
  });

  it('does not change theme for invalid theme name', () => {
    const { result } = renderHook(() => useBunduiTheme());
    const initialTheme = result.current.currentTheme;
    
    act(() => {
      result.current.changeTheme('invalid-theme');
    });
    
    expect(result.current.currentTheme).toBe(initialTheme);
  });

  it('applies initial theme to CSS on mount', () => {
    renderHook(() => useBunduiTheme('modern-dark'));
    
    expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
      '--primary-color',
      '#8b5cf6'
    );
  });

  it('maintains theme state between renders', () => {
    const { result, rerender } = renderHook(() => useBunduiTheme());
    
    act(() => {
      result.current.changeTheme('enterprise-blue');
    });
    
    rerender();
    
    expect(result.current.currentTheme.name).toBe('enterprise-blue');
  });

  it('provides correct theme data structure', () => {
    const { result } = renderHook(() => useBunduiTheme('bundui-light'));
    
    expect(result.current.currentTheme).toHaveProperty('name');
    expect(result.current.currentTheme).toHaveProperty('primaryColor');
    expect(result.current.currentTheme).toHaveProperty('secondaryColor');
    expect(result.current.currentTheme).toHaveProperty('backgroundColor');
    expect(result.current.currentTheme).toHaveProperty('textColor');
  });
}); 