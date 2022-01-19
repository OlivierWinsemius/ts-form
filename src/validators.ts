import { GenericValidator } from "./types";

export const truthyValidator: GenericValidator = (fieldValue) =>
  !fieldValue ? "invalid_value_truthy" : undefined;

type PrimitiveType = "string" | "number" | "boolean" | "undefined";

const typeValidator =
  <T extends PrimitiveType>(type: T): GenericValidator =>
  (fieldValue) =>
    type !== typeof fieldValue ? `invalid_type_${type}` : undefined;

export const stringValidator = typeValidator("string");

export const numberValidator = typeValidator("number");

export const booleanValidator = typeValidator("boolean");

export const undefinedValidator = typeValidator("undefined");

export const nullValidator: GenericValidator = (fieldValue) =>
  fieldValue !== null ? "invalid_type_null" : undefined;

export const dateValidator: GenericValidator = (fieldValue) =>
  !(fieldValue instanceof Date) ? "invalid_type_date" : undefined;

type MinMaxValueType = "number" | "date";
const minValueValidator =
  <V>(minValue: V, type: MinMaxValueType): GenericValidator =>
  (fieldValue) =>
    (fieldValue as V) < minValue ? `invalid_value_min_${type}` : undefined;

const maxValueValidator =
  <V>(maxValue: V, type: MinMaxValueType): GenericValidator =>
  (fieldValue) =>
    (fieldValue as V) > maxValue ? `invalid_value_max_${type}` : undefined;

export const minNumberValidator =
  (minValue: number): GenericValidator =>
  (fieldValue, formValues) =>
    typeValidator("number")(fieldValue, formValues) ??
    minValueValidator(minValue, "number")(fieldValue, formValues);

export const maxNumberValidator =
  (maxValue: number): GenericValidator =>
  (fieldValue, formValues) =>
    typeValidator("number")(fieldValue, formValues) ??
    maxValueValidator(maxValue, "number")(fieldValue, formValues);

export const minDateValidator =
  (minValue: Date): GenericValidator =>
  (fieldValue, formValues) =>
    dateValidator(fieldValue, formValues) ??
    minValueValidator(minValue, "date")(fieldValue, formValues);

export const maxDateValidator =
  (maxValue: Date): GenericValidator =>
  (fieldValue, formValues) =>
    dateValidator(fieldValue, formValues) ??
    maxValueValidator(maxValue, "date")(fieldValue, formValues);

export const oneOf =
  <V extends GenericValidator>(...validators: V[]): GenericValidator =>
  async (fieldValue, formValues) => {
    const messages: string[] = [];

    for (const validator of validators) {
      const validatorMessage = await validator(fieldValue, formValues);

      if (!validatorMessage) {
        return;
      }

      messages.push(validatorMessage);
    }

    return messages.join(" / ");
  };
