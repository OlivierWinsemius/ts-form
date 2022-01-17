import { Form } from "form";
import { FormValidator, FormValues, GenericFormValidator } from "utils/types";
import {
  booleanValidator,
  dateValidator,
  maxDateValidator,
  maxNumberValidator,
  minDateValidator,
  minNumberValidator,
  numberValidator,
  oneOf,
  stringValidator,
} from "validators";

export class FieldValidator<V extends FormValues, F extends keyof V> {
  protected allowUndefined = false;
  protected allowNull = false;
  protected validators: FormValidator<V, F>[] = [];

  custom = (validator: FormValidator<V, F>) => {
    this.validators.push(validator);
    return this;
  };

  string = () => {
    this.validators.push(stringValidator);
    return this;
  };

  number = () => {
    this.validators.push(numberValidator);
    return this;
  };

  boolean = () => {
    this.validators.push(booleanValidator);
    return this;
  };

  date = () => {
    this.validators.push(dateValidator);
    return this;
  };

  minNumber = (min: number) => {
    this.validators.push(minNumberValidator(min));
    return this;
  };

  maxNumber = (max: number) => {
    this.validators.push(maxNumberValidator(max));
    return this;
  };

  minDate = (min: Date) => {
    this.validators.push(minDateValidator(min));
    return this;
  };

  maxDate = (max: Date) => {
    this.validators.push(maxDateValidator(max));
    return this;
  };

  oneOf = (...validators: (() => FieldValidator<V, F>)[]) => {
    validators.forEach((v) => v());

    const validations = this.validators.splice(
      -validators.length
    ) as GenericFormValidator[];

    this.validators.push(oneOf(...validations));
    return this;
  };

  maybe = () => {
    this.allowUndefined = true;
    return this;
  };

  nullable = () => {
    this.allowNull = true;
    return this;
  };
}

export class ActionableFieldValidator<
  V extends FormValues,
  F extends keyof V
> extends FieldValidator<V, F> {
  protected form: Form<V>;
  fieldName: F;
  errors: string[] = [];

  constructor(form: Form<V>, fieldName: F) {
    super();
    this.fieldName = fieldName;
    this.form = form;
  }

  get isValid() {
    return this.errors.length === 0;
  }

  validate = async () => {
    const { form, fieldName, validators, allowNull, allowUndefined } = this;
    const value = form.getFieldValue(fieldName);

    if (allowUndefined && value === undefined) {
      this.errors = [];
      return;
    }

    if (allowNull && value === null) {
      this.errors = [];
      return;
    }

    const errorValidations = await Promise.all(
      validators.map((validate) => validate(value, form.values))
    );

    const errors = [
      ...new Set(
        errorValidations.filter((message): message is string => !!message)
      ),
    ];

    this.errors = errors;

    return errors;
  };
}
