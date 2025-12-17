/**
 * Integration Test: VibeThink Floating Navbar
 * 
 * Tests the adapted Aceternity UI component for:
 * - VibeThink compatibility
 * - Bundui-Premium theming
 * - Multitenant functionality
 * - Role-based access control
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { VibeThinkFloatingNav } from './FloatingNav';

// Mock framer-motion for testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useScroll: () => ({ scrollYProgress: { get: () => 0.1, getPrevious: () => 0.05 } }),
  useMotionValueEvent: jest.fn()
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

const mockNavItems = [
  { name: "Home", link: "/", icon: <span>🏠</span> },
  { name: "Dashboard", link: "/dashboard", permission: "EMPLOYEE" },
  { name: "Analytics", link: "/analytics", permission: "MANAGER" },
  { name: "Admin", link: "/admin", permission: "ADMIN" }
];

describe('VibeThinkFloatingNav', () => {
  
  describe('Basic Functionality', () => {
    it('renders all navigation items for SUPER_ADMIN', () => {
      render(
        <VibeThinkFloatingNav 
          navItems={mockNavItems}
          userRole="SUPER_ADMIN"
        />
      );
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('filters navigation items based on user role', () => {
      render(
        <VibeThinkFloatingNav 
          navItems={mockNavItems}
          userRole="EMPLOYEE"
        />
      );
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });

    it('shows manager-level items for MANAGER role', () => {
      render(
        <VibeThinkFloatingNav 
          navItems={mockNavItems}
          userRole="MANAGER"
        />
      );
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });
  });

  describe('VibeThink Integration', () => {
    it('applies company-specific data attributes', () => {
      const { container } = render(
        <VibeThinkFloatingNav 
          navItems={mockNavItems}
          companyId="123"
          themePreset="rose-garden"
          userRole="ADMIN"
        />
      );
      
      const navElement = container.querySelector('[data-company-theme]');
      expect(navElement).toHaveAttribute('data-company-theme', 'company-123');
      expect(navElement).toHaveAttribute('data-theme-preset', 'rose-garden');
    });

    it('applies Bundui-Premium CSS classes', () => {
      const { container } = render(
        <VibeThinkFloatingNav 
          navItems={mockNavItems}
          userRole="ADMIN"
        />
      );
      
      const navElement = container.querySelector('div');
      expect(navElement).toHaveClass('bg-background/80');
      expect(navElement).toHaveClass('border-border');
      expect(navElement).toHaveClass('backdrop-blur-md');
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <VibeThinkFloatingNav 
          navItems={mockNavItems}
          className="custom-nav-class"
          userRole="ADMIN"
        />
      );
      
      const navElement = container.querySelector('.custom-nav-class');
      expect(navElement).toBeInTheDocument();
    });
  });

  describe('Permission System', () => {
    it('handles items without permissions (public items)', () => {
      const publicItems = [
        { name: "Public Page", link: "/public" }
      ];
      
      render(
        <VibeThinkFloatingNav 
          navItems={publicItems}
          userRole="EMPLOYEE"
        />
      );
      
      expect(screen.getByText('Public Page')).toBeInTheDocument();
    });

    it('correctly implements role hierarchy', () => {
      const hierarchyItems = [
        { name: "Employee", link: "/employee", permission: "EMPLOYEE" },
        { name: "Manager", link: "/manager", permission: "MANAGER" },
        { name: "Admin", link: "/admin", permission: "ADMIN" },
        { name: "Owner", link: "/owner", permission: "OWNER" }
      ];
      
      // Test MANAGER can access EMPLOYEE and MANAGER levels
      render(
        <VibeThinkFloatingNav 
          navItems={hierarchyItems}
          userRole="MANAGER"
        />
      );
      
      expect(screen.getByText('Employee')).toBeInTheDocument();
      expect(screen.getByText('Manager')).toBeInTheDocument();
      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
      expect(screen.queryByText('Owner')).not.toBeInTheDocument();
    });
  });

  describe('Link Generation', () => {
    it('generates correct href attributes', () => {
      render(
        <VibeThinkFloatingNav 
          navItems={mockNavItems}
          userRole="ADMIN"
        />
      );
      
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveAttribute('href', '/');
      
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });
  });

  describe('Accessibility', () => {
    it('maintains semantic link structure', () => {
      render(
        <VibeThinkFloatingNav 
          navItems={mockNavItems}
          userRole="ADMIN"
        />
      );
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('preserves icon and text content', () => {
      const itemsWithIcons = [
        { name: "Home", link: "/", icon: <span data-testid="home-icon">🏠</span> }
      ];
      
      render(
        <VibeThinkFloatingNav 
          navItems={itemsWithIcons}
          userRole="ADMIN"
        />
      );
      
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });
});

/**
 * Integration Test Summary:
 * 
 * ✅ Basic component functionality
 * ✅ Role-based navigation filtering  
 * ✅ Company theming via data attributes
 * ✅ Bundui-Premium CSS class application
 * ✅ Permission hierarchy system
 * ✅ Link generation and accessibility
 * ✅ Icon and text preservation
 * 
 * This validates that the Aceternity UI component has been
 * successfully adapted for VibeThink with full compatibility.
 */
