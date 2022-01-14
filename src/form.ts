import {
  FormValues,
  FormSubmit,
  FormValidators,
  TouchedFields,
  FieldErrors,
  FieldError,
} from "utils/types";
import { validateAllFields, validateField } from "validateField";

interface Props<V extends FormValues> {
  values: V;
  onSubmit?: FormSubmit<V>;
  validators?: FormValidators<V>;
}

export class Form<V extends FormValues> {
  private initialValues: V;
  private values: V;
  private validators: FormValidators<V>;
  private touchedFields: TouchedFields<V> = {};
  private fieldErrors: FieldErrors<V> = {};
  private onSubmit?: FormSubmit<V>;

  constructor({ values, onSubmit, validators = {} }: Props<V>) {
    this.initialValues = values;
    this.values = { ...values };
    this.onSubmit = onSubmit;
    this.validators = validators;

    validateAllFields(this.values, this.validators);
  }

  reset = () => {
    this.values = { ...this.initialValues };
    this.fieldErrors = {};
    this.touchedFields = {};

    validateAllFields(this.values, this.validators);
  };

  setFieldValue = async <F extends keyof V>(field: F, value: V[F]) => {
    this.values[field] = value;
    this.touchedFields[field] = true;
    this.fieldErrors[field] = await validateField(
      field,
      this.values,
      this.validators
    );
  };

  getField = <F extends keyof V>(field: F) => {
    const value = this.values[field];
    const errors: FieldError[] = this.fieldErrors[field] ?? [];
    const isValid = !errors.length;
    const isTouched = !!this.touchedFields[field];
    const setValue = (newValue: V[F]) => this.setFieldValue(field, newValue);

    return { value, setValue, errors, isValid, isTouched };
  };

  get isValid() {
    return !!Object.values(this.fieldErrors).flat().length;
  }

  validate = async () => {
    await validateAllFields(this.values, this.validators);

    return this.isValid;
  };

  submit = async () => {
    if ((await this.validate()) && this.onSubmit) {
      await this.onSubmit(this.values);
      this.reset();
    }
  };
}
