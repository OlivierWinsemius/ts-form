export class FormError extends Error {
  name = "FormError";

  constructor(message: string,) {
    super(message);
  }
}