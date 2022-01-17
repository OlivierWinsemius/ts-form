import {
  booleanValidator,
  numberValidator,
  stringValidator,
  minNumberValidator,
  maxNumberValidator,
  dateValidator,
  maxDateValidator,
  minDateValidator,
  oneOf,
} from "../validators";

describe("validators", () => {
  it("booleanValidator", async () => {
    expect(booleanValidator(true, {})).toBeUndefined();
    expect(booleanValidator(1, {})).toStrictEqual("invalid_type_boolean");
    expect(booleanValidator("test", {})).toStrictEqual("invalid_type_boolean");
    expect(booleanValidator(new Date(), {})).toStrictEqual(
      "invalid_type_boolean"
    );
  });

  it("numberValidator", () => {
    expect(numberValidator(1, {})).toBeUndefined();
    expect(numberValidator(true, {})).toStrictEqual("invalid_type_number");
    expect(numberValidator("test", {})).toStrictEqual("invalid_type_number");
    expect(numberValidator(new Date(), {})).toStrictEqual(
      "invalid_type_number"
    );
  });

  it("stringValidator", () => {
    expect(stringValidator("test", {})).toBeUndefined();
    expect(stringValidator(1, {})).toStrictEqual("invalid_type_string");
    expect(stringValidator(true, {})).toStrictEqual("invalid_type_string");
    expect(stringValidator(new Date(), {})).toStrictEqual(
      "invalid_type_string"
    );
  });

  it("dateValidator", () => {
    expect(dateValidator(new Date(), {})).toBeUndefined();
    expect(dateValidator("test", {})).toStrictEqual("invalid_type_date");
    expect(dateValidator(1, {})).toStrictEqual("invalid_type_date");
    expect(dateValidator(true, {})).toStrictEqual("invalid_type_date");
  });

  it("minNumberValidator", () => {
    const validator = minNumberValidator(10);
    expect(validator(20, {})).toBeUndefined();
    expect(validator(true, {})).toStrictEqual("invalid_type_number");
    expect(validator("test", {})).toStrictEqual("invalid_type_number");
    expect(validator(new Date(), {})).toStrictEqual("invalid_type_number");
    expect(validator(0, {})).toStrictEqual("invalid_value_min_number");
  });

  it("maxNumberValidator", () => {
    const validator = maxNumberValidator(10);
    expect(validator(0, {})).toBeUndefined();
    expect(validator(true, {})).toStrictEqual("invalid_type_number");
    expect(validator("test", {})).toStrictEqual("invalid_type_number");
    expect(validator(new Date(), {})).toStrictEqual("invalid_type_number");
    expect(validator(20, {})).toStrictEqual("invalid_value_max_number");
  });

  it("minDateValidator", () => {
    const validator = minDateValidator(new Date("2020-01-01"));

    expect(validator(new Date("2040-01-01"), {})).toBeUndefined();
    expect(validator(true, {})).toStrictEqual("invalid_type_date");
    expect(validator("test", {})).toStrictEqual("invalid_type_date");
    expect(validator(1, {})).toStrictEqual("invalid_type_date");
    expect(validator(new Date("2000-01-01"), {})).toStrictEqual(
      "invalid_value_min_date"
    );
  });

  it("maxDateValidator", () => {
    const validator = maxDateValidator(new Date("2020-01-01"));
    expect(validator(new Date("2000-01-01"), {})).toBeUndefined();
    expect(validator(true, {})).toStrictEqual("invalid_type_date");
    expect(validator("test", {})).toStrictEqual("invalid_type_date");
    expect(validator(1, {})).toStrictEqual("invalid_type_date");
    expect(validator(new Date("2040-01-01"), {})).toStrictEqual(
      "invalid_value_max_date"
    );
  });

  it("oneOf", async () => {
    const validator = oneOf(numberValidator, stringValidator);
    const message = "invalid_type_number / invalid_type_string";

    expect(await validator(1, {})).toBeUndefined();
    expect(await validator("test", {})).toBeUndefined();
    expect(await validator(true, {})).toStrictEqual(message);
    expect(await validator(new Date(), {})).toStrictEqual(message);
  });
});
