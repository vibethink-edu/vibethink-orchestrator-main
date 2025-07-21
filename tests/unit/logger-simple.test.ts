import { describe, it, expect } from 'vitest';
import { logger } from '../../src/shared/utils/logger';

describe('Logger Simple Test', () => {
  it('should export logger object', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should have correct method signatures', () => {
    const metadata = { service: 'TestService' };
    const message = 'Test message';

    // These should not throw errors
    expect(() => logger.info(metadata, message)).not.toThrow();
    expect(() => logger.warn(metadata, message)).not.toThrow();
    expect(() => logger.error(metadata, message)).not.toThrow();
    expect(() => logger.debug(metadata, message)).not.toThrow();
  });

  it('should handle different metadata types', () => {
    const message = 'Test message';

    // Empty metadata
    expect(() => logger.info({}, message)).not.toThrow();

    // Complex metadata
    const complexMetadata = {
      service: 'TestService',
      operation: 'testOperation',
      userId: 'user123',
      data: {
        nested: {
          value: 'test'
        }
      }
    };
    expect(() => logger.info(complexMetadata, message)).not.toThrow();
  });
}); 