import {
  FormValues,
  FormSubmit,
  TouchedFields,
  FormProperties,
  FieldErrors,
  Validators,
} from "./types";
import { FormError } from "./form-error";
import { FormFieldValidator } from "./field-validator";
import { objectFromKeys } from "./object-from-keys";

export class Form<V extends FormValues> {
  private fieldNames: (keyof V)[];
  private initialValues: V;
  private onSubmit: FormSubmit<V>;
  private validators: Validators<V>;
  private touchedFields: TouchedFields<V>;
  private fieldErrors: FieldErrors<V>;
  values: V;

  protected afterValidate = (_: keyof V): void | Promise<void> => {};

  constructor({ values, onSubmit, validators }: FormProperties<V>) {
    this.initialValues = { ...values };
    this.values = { ...values };
    this.fieldNames = Object.keys(values);
    this.onSubmit = onSubmit;

    this.touchedFields = objectFromKeys(values, () => false);
    this.fieldErrors = objectFromKeys(values, () => []);
    this.validators = objectFromKeys(values, (key) => {
      const validator = new FormFieldValidator(this, key);
      validators?.[key]?.(validator);
      return validator;
    });
  }

  get isValid() {
    return Object.values(this.fieldErrors).every((v) => v.length === 0);
  }

  reset = () => {
    const { initialValues } = this;
    this.values = { ...initialValues };
    this.touchedFields = objectFromKeys(initialValues, () => false);
    this.fieldErrors = objectFromKeys(initialValues, () => []);
  };

  getFieldValue = <F extends keyof V>(field: F) => {
    return this.values[field];
  };

  getFieldErrors = <F extends keyof V>(field: F) => {
    return this.fieldErrors[field];
  };

  getFieldIsTouched = <F extends keyof V>(field: F) => {
    return !!this.touchedFields[field];
  };

  validateField = async <F extends keyof V>(field: F) => {
    this.fieldErrors[field] = await this.validators[field].validate();
  };

  setFieldValue = async <F extends keyof V>(field: F, value: V[F]) => {
    this.values[field] = value;
    this.touchedFields[field] = true;
    await this.validateField(field);
    await this.afterValidate(field);
  };

  getField = <F extends keyof V>(field: F) => {
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
    await Promise.all(this.fieldNames.map(this.validateField));

    if (!this.isValid) {
      throw new FormError(this.fieldErrors);
    }

    return this.onSubmit(this.values);
  };
}
