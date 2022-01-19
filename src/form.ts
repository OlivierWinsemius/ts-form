import {
  FormValues,
  FormSubmit,
  TouchedFields,
  FormProperties,
  FormErrors,
  FormValidators,
  FormField,
} from "./types";
import { FormError } from "./form-error";
import { FormFieldValidator } from "./field-validator";
import { objectFromKeys } from "./object-from-keys";

export class Form<V extends FormValues> {
  protected fieldNames: (keyof V)[];
  protected onSubmit: FormSubmit<V>;
  protected validators: FormValidators<V>;
  protected formErrors: FormErrors<V>;
  protected values: V;
  protected initialValues: V;
  protected afterSubmit: (form: this) => void = () => undefined;
  protected afterValidateForm: (form: this) => void = () => undefined;
  protected afterValidateField: (field: keyof V, form: this) => void = () =>
    undefined;

  protected getFieldValue = <F extends keyof V>(field: F) => {
    return this.values[field];
  };

  protected getFieldErrors = <F extends keyof V>(field: F) => {
    return this.formErrors[field];
  };

  protected getFieldIsTouched = <F extends keyof V>(field: F) => {
    return this.values[field] !== this.initialValues[field];
  };

  protected validateField = async <F extends keyof V>(field: F) => {
    const { values, validators } = this;
    this.formErrors[field] = await validators[field].validate(values);
    this.afterValidateField(field, this);
  };

  protected validateAllFields = async () => {
    const { values, validators, fieldNames } = this;
    const validate = fieldNames.map(async (field) => {
      this.formErrors[field] = await validators[field].validate(values);
    });

    await Promise.all(validate);

    this.afterValidateForm(this);
  };

  protected setFieldValue = <F extends keyof V>(field: F, value: V[F]) => {
    this.values[field] = value;
    return this.validateField(field);
  };

  constructor({ values, onSubmit, validators }: FormProperties<V>) {
    this.initialValues = { ...values };
    this.values = { ...values };
    this.fieldNames = Object.keys(values);
    this.onSubmit = onSubmit;

    this.formErrors = objectFromKeys(values, () => []);
    this.validators = objectFromKeys(values, (key) => {
      const validator = new FormFieldValidator(this, key);
      validators?.[key]?.(validator);
      return validator;
    });

    this.validateAllFields();
  }

  isSubmitting = false;

  get isTouched() {
    const { fieldNames, getFieldIsTouched } = this;
    return !!fieldNames.find((field) => getFieldIsTouched(field));
  }

  get isValid() {
    const { fieldNames, getFieldErrors } = this;
    return fieldNames.every((field) => getFieldErrors(field).length === 0);
  }

  getField = <F extends keyof V>(field: F): FormField<V, F> => {
    const { getFieldIsTouched, getFieldErrors, getFieldValue, setFieldValue } =
      this;

    return {
      get errors() {
        return getFieldErrors(field);
      },
      get isValid() {
        return getFieldErrors(field).length === 0;
      },
      get isTouched() {
        return getFieldIsTouched(field);
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
    this.isSubmitting = true;

    try {
      await this.validateAllFields();

      if (!this.isValid) {
        throw new FormError(this.formErrors);
      }

      await this.onSubmit(this.values, this);
    } finally {
      this.isSubmitting = false;
      this.afterSubmit(this);
    }
  };

  reset = () => {
    const { initialValues } = this;
    this.values = { ...initialValues };
    return this.validateAllFields();
  };
}
