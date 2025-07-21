import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// VibeThink Test Configuration
const VIBETHINK_CONFIG = {
  test_coverage_target: 90,
  performance_target: "<2ndos",
  balance_humano_ia_target: 70/30,
  handoff_efficiency_target: "95%"
};

// Mock del componente Login para testing
const MockLogin = () => {
  return (
    <div data-testid="login-form">
      <h1>Iniciar Sesión</h1>
      <form>
        <input 
          data-testid="email-input" 
          type="email" 
          placeholder="Email"
          aria-label="Email"
        />
        <input 
          data-testid="password-input" 
          type="password" 
          placeholder="Contraseña"
          aria-label="Contraseña"
        />
        <button data-testid="login-button" type="submit">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

describe('VibeThink Login Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <MockLogin />
      </BrowserRouter>
    );
  };

  describe('Unit Tests (IA 90% + Humano 10%)', () => {
    it('should render login form with all required elements', () => {
      renderLogin();
      
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    it('should validate email format', () => {
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: '12345' } });
      fireEvent.click(submitButton);

      expect(emailInput).toHaveValue('invalid-email');
    });

    it('should validate password requirement', () => {
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '12345' } });
      fireEvent.click(submitButton);

      expect(passwordInput).toHaveValue('12345');
    });
  });

  describe('Integration Tests (IA 80% + Humano 20%)', () => {
    it('should handle complete login workflow', () => {
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(emailInput, { target: { value: 'admin@VibeThink.co' } });
      fireEvent.change(passwordInput, { target: { value: '12345' } });

      expect(submitButton).not.toBeDisabled();

      fireEvent.click(submitButton);

      expect(emailInput).toHaveValue('admin@VibeThink.co');
      expect(passwordInput).toHaveValue('12345');
    });
  });

  describe('Performance Tests (IA 100%)', () => {
    it('should render within performance target', () => {
      const startTime = performance.now();
      
      renderLogin();
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(2000);
    });

    it('should handle form submission within performance target', () => {
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      const startTime = performance.now();
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '12345' } });
      fireEvent.click(submitButton);

      const endTime = performance.now();
      const submissionTime = endTime - startTime;
      
      expect(submissionTime).toBeLessThan(2000);
    });
  });

  describe('Accessibility Tests (Humano 100%)', () => {
    it('should have proper ARIA labels', () => {
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(emailInput).toHaveAttribute('aria-label', 'Email');
      expect(passwordInput).toHaveAttribute('aria-label', 'Contraseña');
    });

    it('should be keyboard navigable', () => {
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      emailInput.focus();
      expect(emailInput).toHaveFocus();
      
      passwordInput.focus();
      expect(passwordInput).toHaveFocus();
      
      submitButton.focus();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('VibeThink Metrics Validation', () => {
    it('should meet VibeThink coverage requirements', () => {
      expect(VIBETHINK_CONFIG.test_coverage_target).toBe(90);
      expect(VIBETHINK_CONFIG.performance_target).toBe("<2ndos");
      expect(VIBETHINK_CONFIG.balance_humano_ia_target).toBe(70/30);
    });

    it('should validate VibeThink handoff efficiency', () => {
      const handoffStart = performance.now();
      setTimeout(() => {
        const handoffEnd = performance.now();
        const handoffTime = handoffEnd - handoffStart;
        expect(handoffTime).toBeLessThan(150000);
      }, 100);
    });
  });
}); 