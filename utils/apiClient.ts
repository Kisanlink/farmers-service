/**
 * API Client Factory
 *
 * Creates an API client with injectable configuration using native fetch.
 * Supports authentication, error handling, retry logic, logging, and response validation.
 */

import { FarmerServiceConfig } from '../config';
import { z } from 'zod';
import { validateResponse } from './validators';

export interface ApiClient {
  get: <T>(endpoint: string, options?: RequestOptions) => Promise<T>;
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => Promise<T>;
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => Promise<T>;
  delete: <T>(endpoint: string, options?: RequestOptions) => Promise<T>;
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => Promise<T>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined> | { [key: string]: any };
  timeout?: number;
  signal?: AbortSignal;
  validator?: z.ZodSchema<any>; // Optional Zod schema for response validation
}

/**
 * Build headers for the request, including authentication
 */
function buildHeaders(config: FarmerServiceConfig, extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...config.defaultHeaders, ...(extra || {}) };
  const token = config.getAccessToken?.();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Log request details if logging is enabled
 */
function logRequest(config: FarmerServiceConfig, method: string, url: string, body?: unknown) {
  if (config.logConfig?.enabled && config.logConfig?.logRequests) {
    const logLevel = config.logConfig.logLevel || 'info';
    const message = `[${logLevel.toUpperCase()}] ${method} ${url}`;

    if (logLevel === 'debug') {
      console.debug(message, { body });
    } else if (logLevel === 'info') {
      console.info(message);
    }
  }
}

/**
 * Log response details if logging is enabled
 */
function logResponse(config: FarmerServiceConfig, method: string, url: string, status: number, data?: unknown) {
  if (config.logConfig?.enabled && config.logConfig?.logResponses) {
    const logLevel = config.logConfig.logLevel || 'info';
    const message = `[${logLevel.toUpperCase()}] ${method} ${url} - ${status}`;

    if (logLevel === 'debug') {
      console.debug(message, { data });
    } else if (logLevel === 'info') {
      console.info(message);
    }
  }
}

/**
 * Log error details if logging is enabled
 */
function logError(config: FarmerServiceConfig, method: string, url: string, error: Error) {
  if (config.logConfig?.enabled) {
    console.error(`[ERROR] ${method} ${url} - ${error.message}`);
  }
}

/**
 * Check if an HTTP status code is retryable
 */
function isRetryableStatus(status: number, config: FarmerServiceConfig): boolean {
  const retryableStatusCodes = config.retryConfig?.retryableStatusCodes || [408, 429, 500, 502, 503, 504];
  return retryableStatusCodes.includes(status);
}

/**
 * Sleep for the specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make an HTTP request with retry logic
 */
async function request<T>(
  config: FarmerServiceConfig,
  method: string,
  endpoint: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T> {
  const baseURL = config.baseURL.replace(/\/$/, '');
  const url = new URL(`${baseURL}${endpoint}`);

  // Add query parameters
  if (options?.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    });
  }

  const timeout = options?.timeout || config.timeout || 30000;
  const maxRetries = config.retryConfig?.maxRetries || 3;
  const retryDelay = config.retryConfig?.retryDelay || 1000;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Log request
      logRequest(config, method, url.toString(), body);

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Use provided signal if available, otherwise use controller signal
      const signal = options?.signal || controller.signal;

      const response = await fetch(url.toString(), {
        method,
        headers: buildHeaders(config, options?.headers),
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
      });

      clearTimeout(timeoutId);

      // Log response
      logResponse(config, method, url.toString(), response.status);

      if (!response.ok) {
        // Check if we should retry
        if (attempt < maxRetries && isRetryableStatus(response.status, config)) {
          const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
          await sleep(delay);
          continue;
        }

        // Parse error response
        const text = await response.text().catch(() => '');
        let errorMessage = `API ${method} ${endpoint} failed: ${response.status}`;

        try {
          const errorJson = JSON.parse(text);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          if (text) errorMessage += ` ${text}`;
        }

        const error = new Error(errorMessage) as any;
        error.status = response.status;
        error.response = { status: response.status, data: text };

        logError(config, method, url.toString(), error);
        throw error;
      }

      // Parse successful response
      const rawData = await response.json();

      // Validate response if validator is provided
      if (options?.validator) {
        try {
          const validatedData = validateResponse(options.validator, rawData);
          return validatedData as T;
        } catch (validationError: any) {
          // Log validation error
          logError(config, method, url.toString(), validationError);

          // Create a more informative error
          const error = new Error(`Response validation failed: ${validationError.message}`) as any;
          error.status = 500;
          error.response = { status: 500, data: rawData };
          error.validationError = validationError;
          throw error;
        }
      }

      return rawData as T;
    } catch (error: any) {
      lastError = error;

      // Handle abort/timeout errors
      if (error.name === 'AbortError') {
        const timeoutError = new Error(`Request timeout after ${timeout}ms`) as any;
        timeoutError.status = 408;
        logError(config, method, url.toString(), timeoutError);
        throw timeoutError;
      }

      // Handle network errors
      if (error.message.includes('fetch')) {
        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
          await sleep(delay);
          continue;
        }
      }

      // Don't retry client errors (4xx except 408 and 429)
      if (error.status && error.status >= 400 && error.status < 500 &&
          !isRetryableStatus(error.status, config)) {
        logError(config, method, url.toString(), error);
        throw error;
      }

      // Retry on other errors
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
        await sleep(delay);
        continue;
      }

      logError(config, method, url.toString(), error);
      throw error;
    }
  }

  // If we've exhausted all retries
  if (lastError) {
    throw lastError;
  }

  throw new Error('Request failed after all retry attempts');
}

/**
 * Factory function to create an API client with injectable configuration
 *
 * @param config - API configuration (baseURL, headers, token getter)
 * @returns Object with HTTP method functions (get, post, put, delete, patch)
 *
 * @example
 * const api = createApiClient({
 *   baseURL: 'https://api.example.com',
 *   getAccessToken: () => localStorage.getItem('access_token') || undefined
 * });
 * const response = await api.get('/users');
 */
const createApiClient = (config: FarmerServiceConfig): ApiClient => {
  return {
    get: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(config, 'GET', endpoint, undefined, options),

    post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(config, 'POST', endpoint, body, options),

    put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(config, 'PUT', endpoint, body, options),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(config, 'DELETE', endpoint, undefined, options),

    patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(config, 'PATCH', endpoint, body, options),
  };
};

export default createApiClient;
