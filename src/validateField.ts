import { objectFromKeys } from "utils/objectFromKeys";
import { FieldError, FormValidators, FormValues } from "utils/types";

export const validateField = async <V extends FormValues>(
  field: keyof V,
  values: V,
  validators: FormValidators<V>
) => {
  const errors: FieldError[] = [];
  const value = values[field];
  const fieldValidators = validators[field] ?? [];

  for (const validator of fieldValidators) {
    const error = await validator(value, values);

    if (error) {
      errors.push(error);
    }
  }

  return errors;
};

export const validateAllFields = async <V extends FormValues>(
  values: V,
  validators: FormValidators<V>
) => {
  const errors = objectFromKeys<V, FieldError[]>(values, []);

  const fields = Object.keys(errors);
  for (const field of fields) {
    const fieldErrors = await validateField(field, values, validators);
    errors[field].push(...fieldErrors);
  }

  return errors;
};
