import { GenericFormValidator } from "./types";

type PrimitiveType = "string" | "number" | "boolean" | "undefined";

const typeValidator =
  <T extends PrimitiveType>(type: T): GenericFormValidator =>
  (fieldValue) =>
    type !== typeof fieldValue ? `invalid_type_${type}` : undefined;

export const stringValidator = typeValidator("string");

export const numberValidator = typeValidator("number");

export const booleanValidator = typeValidator("boolean");

export const undefinedValidator = typeValidator("undefined");

export const nullValidator: GenericFormValidator = (fieldValue) =>
  fieldValue !== null ? "invalid_type_null" : undefined;

export const dateValidator: GenericFormValidator = (fieldValue) =>
  !(fieldValue instanceof Date) ? "invalid_type_date" : undefined;

type MinMaxValueType = "number" | "date";
const minValueValidator =
  <V>(minValue: V, type: MinMaxValueType): GenericFormValidator =>
  (fieldValue) =>
    (fieldValue as V) < minValue ? `invalid_value_min_${type}` : undefined;

const maxValueValidator =
  <V>(maxValue: V, type: MinMaxValueType): GenericFormValidator =>
  (fieldValue) =>
    (fieldValue as V) > maxValue ? `invalid_value_max_${type}` : undefined;

export const minNumberValidator =
  (minValue: number): GenericFormValidator =>
  (fieldValue, formValues) =>
    typeValidator("number")(fieldValue, formValues) ??
    minValueValidator(minValue, "number")(fieldValue, formValues);

export const maxNumberValidator =
  (maxValue: number): GenericFormValidator =>
  (fieldValue, formValues) =>
    typeValidator("number")(fieldValue, formValues) ??
    maxValueValidator(maxValue, "number")(fieldValue, formValues);

export const minDateValidator =
  (minValue: Date): GenericFormValidator =>
  (fieldValue, formValues) =>
    dateValidator(fieldValue, formValues) ??
    minValueValidator(minValue, "date")(fieldValue, formValues);

export const maxDateValidator =
  (maxValue: Date): GenericFormValidator =>
  (fieldValue, formValues) =>
    dateValidator(fieldValue, formValues) ??
    maxValueValidator(maxValue, "date")(fieldValue, formValues);

export const oneOf =
  <V extends GenericFormValidator>(...validators: V[]): GenericFormValidator =>
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
