import {
  FormField,
  FormErrors,
  FormSubmit,
  FormValues,
  FormProperties,
  FormValidators,
  FormSubmitState,
  FormEvents,
} from "./types";
import { FormError } from "./form-error";
import { FormFieldValidator } from "./field-validator";
import { cloneObjectWithDefaultValue } from "./clone-object";

const emptyEvent = () => {
  return undefined;
};

abstract class BaseForm<Values extends FormValues> {
  protected fieldNames: (keyof Values)[];
  protected formValues: Values;
  protected initialFormValues: Values;

  protected onSubmit: FormSubmit<Values>;
  protected formErrors: FormErrors<Values>;
  protected formEvents: FormEvents<Values>;
  protected formSubmitState: FormSubmitState;
  protected formValidators: FormValidators<Values>;

  constructor({
    values,
    onSubmit,
    validators,
    events,
  }: FormProperties<Values>) {
    this.initialFormValues = { ...values };

    this.formValues = { ...values };

    this.fieldNames = Object.keys(values);

    this.formSubmitState = {};

    this.formEvents = events ?? {
      afterReset: emptyEvent,
      beforeSubmit: emptyEvent,
      afterSubmit: emptyEvent,
      afterValidate: emptyEvent,
    };

    this.onSubmit = onSubmit;

    this.formErrors = cloneObjectWithDefaultValue(this.formValues, () => []);

    this.formValidators = cloneObjectWithDefaultValue(
      this.formValues,
      (key) => {
        const validator = new FormFieldValidator<Values>();
        validators?.[key]?.(validator);
        return validator;
      }
    );
  }
}

export class Form<Values extends FormValues> extends BaseForm<Values> {
  protected getFieldValue = <Field extends keyof Values>(field: Field) => {
    return this.formValues[field];
  };

  protected getFieldErrors = <Field extends keyof Values>(field: Field) => {
    return this.formErrors[field];
  };

  protected getIsFieldTouched = <Field extends keyof Values>(field: Field) => {
    return this.formValues[field] !== this.initialFormValues[field];
  };

  protected getIsSubmitting = () => {
    return this.formSubmitState.isSubmitting;
  };

  protected getIsSubmitted = () => {
    return this.formSubmitState.isSubmitted;
  };

  protected getIsTouched = () => {
    return !!this.fieldNames.find((field) => this.getIsFieldTouched(field));
  };

  protected getIsValid = () => {
    return Object.values(this.formErrors).flat().length === 0;
  };

  protected validateField = async <Field extends keyof Values>(
    field: Field
  ) => {
    const { validate } = this.formValidators[field];
    this.formErrors[field] = await validate(this.formValues, field);
    this.formEvents.afterValidate(field, this);
  };

  protected validateAllFields = async () => {
    let isInvalid = false;

    for (const field of this.fieldNames) {
      const { validate } = this.formValidators[field];
      const errors = await validate(this.formValues, field);
      this.formErrors[field] = errors;
      isInvalid = isInvalid || errors.length > 0;
    }

    return !isInvalid;
  };

  protected setFieldValue = <Field extends keyof Values>(
    field: Field,
    value: Values[Field]
  ) => {
    if (this.formSubmitState.isSubmitting) {
      return Promise.resolve();
    }

    this.formValues[field] = value;

    return this.validateField(field);
  };

  get isValid() {
    return this.getIsValid();
  }

  get isTouched() {
    return this.getIsTouched();
  }

  get isSubmitting() {
    return this.getIsSubmitting();
  }

  get isSubmitted() {
    return this.getIsSubmitted();
  }

  getField = <Field extends keyof Values>(
    field: Field
  ): FormField<Values[Field]> => {
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
      setValue(value: Values[Field]) {
        return setFieldValue(field, value);
      },
    };
  };

  submit = async () => {
    if (this.formSubmitState.isSubmitting) {
      return;
    }

    this.formSubmitState = { isSubmitted: false, isSubmitting: true };
    this.formEvents.beforeSubmit(this);

    try {
      const isValid = await this.validateAllFields();
      if (!isValid) {
        throw new FormError(this.formErrors);
      }

      await this.onSubmit(this.formValues, this);
      this.formSubmitState.isSubmitted = true;
    } finally {
      this.formSubmitState.isSubmitting = false;
      this.formEvents.afterSubmit(this);
    }
  };

  reset = async () => {
    this.formValues = { ...this.initialFormValues };
    this.formSubmitState = {};
    await this.validateAllFields();
    this.formEvents.afterReset(this);
  };
}
