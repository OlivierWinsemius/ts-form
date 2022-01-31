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
import { cloneObjectWithDefaultValue } from "./object-from-keys";

export class Form<Values extends FormValues> {
  protected onSubmit: FormSubmit<Values>;
  protected fieldNames: (keyof Values)[];
  protected formErrors: FormErrors<Values>;
  protected formValidators: FormValidators<Values>;
  protected formValues: Values;
  protected initialFormValues: Values;
  protected isFormSubmitting = false;
  protected isFormSubmitted = false;

  protected afterReset: (form: this) => void;
  protected beforeSubmit: (form: this) => void;
  protected afterSubmit: (form: this) => void;
  protected afterValidate: (field: keyof Values, form: this) => void;

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
    return this.isFormSubmitting;
  };

  protected getIsSubmitted = () => {
    return this.isFormSubmitted;
  };

  protected getIsTouched = () => {
    const { fieldNames, getIsFieldTouched } = this;
    return !!fieldNames.find((field) => getIsFieldTouched(field));
  };

  protected getIsValid = () => {
    return Object.values(this.formErrors).flat().length === 0;
  };

  protected validateField = async <Field extends keyof Values>(
    field: Field
  ) => {
    const { formValues, formValidators } = this;
    const { validate } = formValidators[field];
    this.formErrors[field] = await validate(formValues, field);
    this.afterValidate(field, this);
  };

  protected validateAllFields = async () => {
    const { formValues, formValidators, fieldNames } = this;

    let isInvalid = false;
    for (const field of fieldNames) {
      const { validate } = formValidators[field];
      const errors = await validate(formValues, field);
      this.formErrors[field] = errors;
      isInvalid = isInvalid || errors.length > 0;
    }

    return !isInvalid;
  };

  protected setFieldValue = <Field extends keyof Values>(
    field: Field,
    value: Values[Field]
  ) => {
    if (this.isFormSubmitting) {
      return Promise.resolve();
    }

    this.formValues[field] = value;
    return this.validateField(field);
  };

  constructor({
    values,
    onSubmit,
    validators,
    afterReset = () => undefined,
    afterSubmit = () => undefined,
    afterValidate = () => undefined,
    beforeSubmit = () => undefined,
  }: FormProperties<Values>) {
    this.initialFormValues = { ...values };
    this.formValues = { ...values };
    this.fieldNames = Object.keys(values);
    this.onSubmit = onSubmit;

    this.afterReset = afterReset;
    this.afterSubmit = afterSubmit;
    this.afterValidate = afterValidate;
    this.beforeSubmit = beforeSubmit;

    this.formErrors = cloneObjectWithDefaultValue(this.formValues, () => []);
    this.formValidators = cloneObjectWithDefaultValue(
      this.formValues,
      (key) => {
        const validator = new FormFieldValidator<Values>();
        validators?.[key]?.(validator);
        return validator;
      }
    );

    this.reset();
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
    const {
      validateAllFields,
      onSubmit,
      afterSubmit,
      formValues,
      isFormSubmitting,
    } = this;

    if (isFormSubmitting) {
      return;
    }

    this.isFormSubmitted = false;
    this.isFormSubmitting = true;
    this.beforeSubmit(this);

    try {
      const isValid = await validateAllFields();
      if (!isValid) {
        throw new FormError(this.formErrors);
      }

      await onSubmit(formValues, this);
      this.isFormSubmitted = true;
    } finally {
      this.isFormSubmitting = false;
      afterSubmit(this);
    }
  };

  reset = async () => {
    this.formValues = { ...this.initialFormValues };
    this.isFormSubmitting = false;
    this.isFormSubmitted = false;
    await this.validateAllFields();
    this.afterReset(this);
  };
}
