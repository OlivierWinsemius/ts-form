import { Validator, FormValues, GenericValidator } from "./types";
import {
  truthyValidator,
  booleanValidator,
  dateValidator,
  maxDateValidator,
  maxNumberValidator,
  minDateValidator,
  minNumberValidator,
  nullValidator,
  numberValidator,
  oneOf,
  stringValidator,
  undefinedValidator,
  emailValidator,
} from "./validators";

export class FieldValidator<V extends FormValues> {
  protected allowUndefined = false;
  protected allowNull = false;
  protected validators: Validator<V, keyof V>[] = [];

  custom = (validator: Validator<V, keyof V>) => {
    this.validators.push(validator);
    return this;
  };

  truthy = () => {
    this.validators.push(truthyValidator);
    return this;
  };

  string = () => {
    this.validators.push(stringValidator);
    return this;
  };

  email = () => {
    this.validators.push(emailValidator);
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

  oneOf = (...validators: (() => FieldValidator<V>)[]) => {
    validators.forEach((v) => v());

    const validations = this.validators.splice(
      -validators.length
    ) as GenericValidator[];

    this.validators.push(oneOf(...validations));
    return this;
  };

  maybe = () => {
    this.allowUndefined = true;
    this.validators.push(undefinedValidator);
    return this;
  };

  nullable = () => {
    this.allowNull = true;
    this.validators.push(nullValidator);
    return this;
  };
}

export class FormFieldValidator<
  V extends FormValues
> extends FieldValidator<V> {
  private shouldValidate = <F extends keyof V>(value: V[F]) => {
    if (value === undefined) {
      return !this.allowUndefined;
    }

    if (value === null) {
      return !this.allowNull;
    }

    return true;
  };

  private shouldValidateAfter = (errors: string[]) => {
    const errorSet = new Set(errors);

    if (this.allowUndefined) {
      errorSet.delete("invalid_type_undefined");
    } else if (this.allowNull) {
      errorSet.delete("invalid_type_null");
    }

    return [...errorSet];
  };

  private getValidationErrors = async <F extends keyof V>(
    value: V[F],
    formValues: V
  ) => {
    const validationPromises = this.validators.map((v) => v(value, formValues));
    const validationMessages = await Promise.all(validationPromises);
    const messages = validationMessages.filter((m): m is string => !!m);

    return this.shouldValidateAfter(messages);
  };

  validate = <F extends keyof V>(
    formValues: V,
    fieldName: F
  ): Promise<string[]> => {
    const value = formValues[fieldName];

    if (!this.shouldValidate(value)) {
      return Promise.resolve([]);
    }

    return this.getValidationErrors(value, formValues);
  };
}
