import type { AuthError } from '@supabase/supabase-js';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super('AUTH_ERROR', message, 401, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 422, details);
  }
}

export const handleAuthError = (error: AuthError | Error): AppError => {
  if ('status' in error) {
    const authError = error as AuthError;
    switch (authError.status) {
      case 400:
        return new ValidationError(
          authError.message || 'Invalid credentials format'
        );
      case 401:
        return new AuthenticationError(
          authError.message || 'Invalid email or password'
        );
      case 422:
        return new ValidationError(
          authError.message || 'Invalid input data'
        );
      default:
        return new AppError(
          'AUTH_ERROR',
          authError.message || 'An unexpected authentication error occurred',
          authError.status || 500
        );
    }
  }
  
  return new AppError(
    'UNKNOWN_ERROR',
    error.message || 'An unexpected error occurred',
    500
  );
};

export const isAuthError = (error: any): error is AuthError => {
  return error && '__isAuthError' in error;
};