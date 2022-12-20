export class ApiError extends Error {
  public statusCode: number
  constructor(name: string, statusCode: number, message?: string) {
    super(message)
    this.name = name
    this.statusCode = statusCode
  }
}

export interface ApiErrorType {
  name: string
  message?: string
}

export interface InternalError {
  message: 'Internal Server Error'
}

export interface ValidateErrorJSON {
  message: 'Validation failed'
  details: { [name: string]: unknown }
}
