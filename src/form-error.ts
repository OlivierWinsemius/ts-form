import { FormErrors, FormValues } from "./types";

export class FormError<Values extends FormValues> extends Error {
  name = "FormError";
  formErrors: FormErrors<Values>;

  constructor(formErrors: FormErrors<Values>) {
    super(
      Object.entries(formErrors)
        .flatMap(([fieldName, errors]) =>
          [fieldName, errors.map((e) => `\t- ${e}`).join("\n")].join(":\n")
        )
        .join("\n")
    );

    this.formErrors = formErrors;
  }
}
