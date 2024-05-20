class ErrorHandeler {
  constructor(status, msg) {
    this.status = status;
    this.message = msg;
  }
  static validationError(message = "All feilds are required!") {
    return new ErrorHandeler(400, message);
  }
  static notFoundError(message = "Not found!") {
    return new ErrorHandeler(404, message);
  }
  static serverError(message = "Internal server error") {
    return new ErrorHandeler(500, message);
  }
  static forbidden(message = "Not allowed!") {
    return new ErrorHandeler(403, message);
  }
}
export default ErrorHandeler;
