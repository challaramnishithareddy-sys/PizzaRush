/**
 * Standardized API response wrapper.
 * Ensures all API responses follow the same shape.
 */
export class ApiResponse<T = unknown> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data: T | null;

  constructor(statusCode: number, message: string, data: T | null = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
