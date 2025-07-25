class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = "") {
    super(message); // throw new Error ("something went wrong") this is happening in super
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
