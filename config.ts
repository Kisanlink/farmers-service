/**
 * Farmers Service Configuration
 *
 * Configuration interface for the Farmers Service client.
 * Supports dependency injection and runtime configuration.
 */

export interface FarmerServiceConfig {
  /**
   * Base URL for the Farmers Service API
   * @example 'https://api.example.com' or 'http://localhost:8000'
   */
  baseURL: string;

  /**
   * Default headers to include in all requests
   * @example { 'Content-Type': 'application/json', 'X-API-Version': 'v1' }
   */
  defaultHeaders?: Record<string, string>;

  /**
   * Function to retrieve the access token for authentication
   * @returns Access token string or undefined if not authenticated
   * @example () => localStorage.getItem('access_token') || undefined
   */
  getAccessToken?: () => string | undefined;

  /**
   * Request timeout in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Retry configuration for failed requests
   */
  retryConfig?: {
    /**
     * Maximum number of retry attempts
     * @default 3
     */
    maxRetries: number;

    /**
     * Initial delay between retries in milliseconds
     * @default 1000 (1 second)
     */
    retryDelay: number;

    /**
     * HTTP status codes that should trigger a retry
     * @default [408, 429, 500, 502, 503, 504]
     */
    retryableStatusCodes: number[];
  };

  /**
   * Logging configuration
   */
  logConfig?: {
    /**
     * Enable request/response logging
     * @default false
     */
    enabled: boolean;

    /**
     * Log level
     * @default 'error'
     */
    logLevel: 'debug' | 'info' | 'warn' | 'error';

    /**
     * Log outgoing requests
     * @default false
     */
    logRequests: boolean;

    /**
     * Log incoming responses
     * @default false
     */
    logResponses: boolean;
  };
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<FarmerServiceConfig> = {
  timeout: 30000,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  },
  logConfig: {
    enabled: false,
    logLevel: 'error',
    logRequests: false,
    logResponses: false,
  },
};
