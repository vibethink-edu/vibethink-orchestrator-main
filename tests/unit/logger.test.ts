import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '../../src/shared/utils/logger';

// Mock console methods
const mockConsole = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn()
};

// Mock global console
global.console = mockConsole as any;

describe('Logger Implementation', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('logger.info', () => {
    it('should log info messages with metadata', () => {
      const metadata = {
        service: 'TestService',
        operation: 'testOperation',
        userId: 'user123'
      };
      const message = 'Test info message';

      logger.info(metadata, message);

      expect(mockConsole.info).toHaveBeenCalledWith(
        '[INFO] Test info message',
        metadata
      );
    });

    it('should include timestamp in log output', () => {
      const metadata = { service: 'TestService' };
      const message = 'Test message';

      logger.info(metadata, message);

      expect(mockConsole.info).toHaveBeenCalledWith(
        '[INFO] Test message',
        metadata
      );
    });
  });

  describe('logger.warn', () => {
    it('should log warning messages with metadata', () => {
      const metadata = {
        service: 'TestService',
        operation: 'testOperation',
        warning: 'test warning'
      };
      const message = 'Test warning message';

      logger.warn(metadata, message);

      expect(mockConsole.warn).toHaveBeenCalledWith(
        '[WARN] Test warning message',
        metadata
      );
    });
  });

  describe('logger.error', () => {
    it('should log error messages with metadata', () => {
      const metadata = {
        service: 'TestService',
        operation: 'testOperation',
        error: 'test error'
      };
      const message = 'Test error message';

      logger.error(metadata, message);

      expect(mockConsole.error).toHaveBeenCalledWith(
        '[ERROR] Test error message',
        metadata
      );
    });

    it('should handle error objects in metadata', () => {
      const error = new Error('Test error');
      const metadata = {
        service: 'TestService',
        operation: 'testOperation',
        error: error.message
      };
      const message = 'Test error message';

      logger.error(metadata, message);

      expect(mockConsole.error).toHaveBeenCalledWith(
        '[ERROR] Test error message',
        metadata
      );
    });
  });

  describe('logger.debug', () => {
    it('should log debug messages in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const metadata = { service: 'TestService' };
      const message = 'Test debug message';

      logger.debug(metadata, message);

      expect(mockConsole.debug).toHaveBeenCalledWith(
        '[DEBUG] Test debug message',
        metadata
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not log debug messages in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const metadata = { service: 'TestService' };
      const message = 'Test debug message';

      logger.debug(metadata, message);

      expect(mockConsole.debug).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Environment-based logging', () => {
    it('should respect environment-based logging for info', () => {
      const originalEnv = process.env.NODE_ENV;
      
      // Test development environment
      process.env.NODE_ENV = 'development';
      const metadata = { service: 'TestService' };
      const message = 'Test message';

      logger.info(metadata, message);
      expect(mockConsole.info).toHaveBeenCalled();

      // Clear mocks
      vi.clearAllMocks();

      // Test production environment
      process.env.NODE_ENV = 'production';
      logger.info(metadata, message);
      
      // In production, info logging should not be called
      expect(mockConsole.info).not.toHaveBeenCalled();

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Metadata validation', () => {
    it('should handle empty metadata', () => {
      const message = 'Test message';

      logger.info({}, message);

      expect(mockConsole.info).toHaveBeenCalledWith(
        '[INFO] Test message',
        {}
      );
    });

    it('should handle complex metadata objects', () => {
      const metadata = {
        service: 'TestService',
        operation: 'testOperation',
        userId: 'user123',
        companyId: 'company456',
        data: {
          nested: {
            value: 'test'
          }
        }
      };
      const message = 'Test message';

      logger.info(metadata, message);

      expect(mockConsole.info).toHaveBeenCalledWith(
        '[INFO] Test message',
        metadata
      );
    });
  });

  describe('Message formatting', () => {
    it('should format messages correctly', () => {
      const metadata = { service: 'TestService' };
      const message = 'Test message with special chars: !@#$%^&*()';

      logger.info(metadata, message);

      expect(mockConsole.info).toHaveBeenCalledWith(
        '[INFO] Test message with special chars: !@#$%^&*()',
        metadata
      );
    });

    it('should handle long messages', () => {
      const metadata = { service: 'TestService' };
      const message = 'A'.repeat(1000); // Very long message

      logger.info(metadata, message);

      expect(mockConsole.info).toHaveBeenCalledWith(
        '[INFO] ' + message,
        metadata
      );
    });
  });
}); 