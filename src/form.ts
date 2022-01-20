import {
  FormValues,
  FormSubmit,
  FormProperties,
  FormErrors,
  FormValidators,
  FormField,
} from "./types";
import { FormError } from "./form-error";
import { FormFieldValidator } from "./field-validator";
import { objectFromKeys } from "./object-from-keys";

export class Form<V extends FormValues> {
  protected onSubmit: FormSubmit<V>;
  protected fieldNames: (keyof V)[];
  protected formValidators: FormValidators<V>;
  protected formErrors: FormErrors<V>;
  protected formValues: V;
  protected initialFormValues: V;
  protected isFormSubmitting = false;

  protected afterReset: (form: this) => void = () => undefined;
  protected beforeSubmit: (form: this) => void = () => undefined;
  protected afterSubmit: (form: this) => void = () => undefined;
  protected afterValidate: (field: keyof V, form: this) => void = () =>
    undefined;

  protected getFieldValue = <F extends keyof V>(field: F) => {
    return this.formValues[field];
  };

  protected getFieldErrors = <F extends keyof V>(field: F) => {
    return this.formErrors[field];
  };

  protected getIsFieldTouched = <F extends keyof V>(field: F) => {
    return this.formValues[field] !== this.initialFormValues[field];
  };

  protected getIsSubmitting = () => {
    return this.isFormSubmitting;
  };

  protected getIsTouched = () => {
    const { fieldNames, getIsFieldTouched } = this;
    return !!fieldNames.find((field) => getIsFieldTouched(field));
  };

  protected getIsValid = () => {
    const { fieldNames, getFieldErrors } = this;
    return fieldNames.every((field) => getFieldErrors(field).length === 0);
  };

  protected validateField = async <F extends keyof V>(field: F) => {
    const { formValues, formValidators } = this;
    const { validate } = formValidators[field];
    this.formErrors[field] = await validate(formValues, field);
    this.afterValidate(field, this);
  };

  protected validateAllFields = async () => {
    const { formValues, formValidators, fieldNames } = this;

    const validate = fieldNames.map(async (field) => {
      const errors = await formValidators[field].validate(formValues, field);
      this.formErrors[field] = errors;
      return errors;
    });

    const allErrors = await Promise.all(validate);
    return allErrors.flat();
  };

  protected setFieldValue = <F extends keyof V>(field: F, value: V[F]) => {
    this.formValues[field] = value;
    return this.validateField(field);
  };

  constructor({ values, onSubmit, validators }: FormProperties<V>) {
    this.initialFormValues = { ...values };
    this.formValues = { ...values };
    this.fieldNames = Object.keys(values);
    this.onSubmit = onSubmit;

    this.formErrors = objectFromKeys(values, () => []);
    this.formValidators = objectFromKeys(values, (key) => {
      const validator = new FormFieldValidator<V>();
      validators?.[key]?.(validator);
      return validator;
    });
  }

  get isValid() {
    return this.getIsValid();
  }

  get isTouched() {
    return this.getIsTouched();
  }

  get isSubmitting() {
    return this.getIsSubmitting();
  }

  getField = <F extends keyof V>(field: F): FormField<V[F]> => {
    const { getIsFieldTouched, getFieldErrors, getFieldValue, setFieldValue } =
      this;

    return {
      get errors() {
        return getFieldErrors(field);
      },
      get isValid() {
        return getFieldErrors(field).length === 0;
      },
      get isTouched() {
        return getIsFieldTouched(field);
      },
      get value() {
        return getFieldValue(field);
      },
      setValue(value: V[F]) {
        return setFieldValue(field, value);
      },
    };
  };

  submit = async () => {
    const { validateAllFields, onSubmit, afterSubmit, formValues } = this;

    this.isFormSubmitting = true;
    this.beforeSubmit(this);

    try {
      const errors = await validateAllFields();
      if (errors.length > 0) {
        throw new FormError(this.formErrors);
      }

      await onSubmit(formValues, this);
    } finally {
      this.isFormSubmitting = false;
      afterSubmit(this);
    }
  };

  reset = () => {
    this.formValues = { ...this.initialFormValues };
    this.validateAllFields();
    this.afterReset(this);
  };
}
