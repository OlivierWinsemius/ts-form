import {
  FormValues,
  FormSubmit,
  FormValidators,
  TouchedFields,
} from "utils/types";
import { FormError } from "formError.ts";
import { ActionableFieldValidator } from "fieldValidator";
import { objectFromKeys } from "utils/objectFromKeys";

interface Props<V extends FormValues> {
  values: V;
  onSubmit: FormSubmit<V>;
  validators?: FormValidators<V>;
}

export class Form<V extends FormValues> {
  private initialValues: V;
  private validators: Record<keyof V, ActionableFieldValidator<V, keyof V>>;
  private touchedFields: TouchedFields<V> = {};
  private onSubmit: FormSubmit<V>;
  values: V;

  constructor({ values, onSubmit, validators }: Props<V>) {
    this.initialValues = { ...values };
    this.values = { ...values };
    this.onSubmit = onSubmit;
    this.validators = objectFromKeys(values, key => {
      const validator = new ActionableFieldValidator(this, key)
      validators?.[key]?.(validator);
      return validator
    });
  }

  get isValid() {
    return Object.values(this.validators).every(v => v.errors.length === 0)
  }

  reset = () => {
    this.values = { ...this.initialValues };
    this.touchedFields = {};
  };

  getFieldValue = <F extends keyof V>(field: F) => {
    return this.values[field];
  };

  getFieldErrors = <F extends keyof V>(field: F) => {
    return this.validators[field].errors
  };

  getFieldIsTouched = <F extends keyof V>(field: F) => {
    return !!this.touchedFields[field];
  };

  setFieldValue = async <F extends keyof V>(field: F, value: V[F]) => {
    this.values[field] = value;
    this.touchedFields[field] = true;
    await this.validators[field].validate()
  };

  getField = <F extends keyof V>(field: F) => {
    const { getFieldIsTouched, getFieldErrors, getFieldValue, setFieldValue } = this;
    return {
      get errors() {
        return getFieldErrors(field)
      },
      get isValid() {
        return !getFieldErrors(field).length
      },
      get isTouched() {
        return getFieldIsTouched(field);
      },
      get value() {
        return getFieldValue(field)
      },
      setValue(newValue: V[F]) {
        return setFieldValue(field, newValue);
      },
    };
  };

  submit = async () => {
    await Promise.all(Object.values(this.validators).map(validator => validator.validate()));
    const errorFieldValidators = Object.values(this.validators).filter(v => v.errors.length)
    const errors = errorFieldValidators.map(v => `${v.fieldName}:\n\t- ${v.errors.join("\n\t- ")}`)

    if (errors.length) {
      throw new FormError(`${errors.join('\n\n')}`)
    }

    return this.onSubmit(this.values);
  };
}