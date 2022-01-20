import {
  truthyValidator,
  booleanValidator,
  numberValidator,
  stringValidator,
  undefinedValidator,
  nullValidator,
  minNumberValidator,
  maxNumberValidator,
  dateValidator,
  maxDateValidator,
  minDateValidator,
  emailValidator,
  oneOf,
} from "../validators";

describe("validators", () => {
  it("truthyValidator", () => {
    const message = "invalid_value_truthy";

    expect(truthyValidator(true, {})).toBeUndefined();
    expect(truthyValidator("test", {})).toBeUndefined();
    expect(truthyValidator(1, {})).toBeUndefined();
    expect(truthyValidator(new Date(), {})).toBeUndefined();

    expect(truthyValidator(false, {})).toStrictEqual(message);
    expect(truthyValidator("", {})).toStrictEqual(message);
    expect(truthyValidator(0, {})).toStrictEqual(message);
    expect(truthyValidator(-0, {})).toStrictEqual(message);
    expect(truthyValidator(null, {})).toStrictEqual(message);
    expect(truthyValidator(undefined, {})).toStrictEqual(message);
  });

  it("booleanValidator", () => {
    const message = "invalid_type_boolean";

    expect(booleanValidator(true, {})).toBeUndefined();
    expect(booleanValidator(null, {})).toStrictEqual(message);
    expect(booleanValidator(undefined, {})).toStrictEqual(message);
    expect(booleanValidator(1, {})).toStrictEqual(message);
    expect(booleanValidator("test", {})).toStrictEqual(message);
    expect(booleanValidator(new Date(), {})).toStrictEqual(message);
  });

  it("numberValidator", () => {
    const message = "invalid_type_number";

    expect(numberValidator(1, {})).toBeUndefined();
    expect(numberValidator(null, {})).toStrictEqual(message);
    expect(numberValidator(undefined, {})).toStrictEqual(message);
    expect(numberValidator(true, {})).toStrictEqual(message);
    expect(numberValidator("test", {})).toStrictEqual(message);
    expect(numberValidator(new Date(), {})).toStrictEqual(message);
  });

  it("stringValidator", () => {
    const message = "invalid_type_string";

    expect(stringValidator("test", {})).toBeUndefined();
    expect(stringValidator(null, {})).toStrictEqual(message);
    expect(stringValidator(undefined, {})).toStrictEqual(message);
    expect(stringValidator(1, {})).toStrictEqual(message);
    expect(stringValidator(true, {})).toStrictEqual(message);
    expect(stringValidator(new Date(), {})).toStrictEqual(message);
  });

  it("undefinedValidator", () => {
    const message = "invalid_type_undefined";

    expect(undefinedValidator(undefined, {})).toBeUndefined();
    expect(undefinedValidator(null, {})).toStrictEqual(message);
    expect(undefinedValidator("test", {})).toStrictEqual(message);
    expect(undefinedValidator(1, {})).toStrictEqual(message);
    expect(undefinedValidator(true, {})).toStrictEqual(message);
    expect(undefinedValidator(new Date(), {})).toStrictEqual(message);
  });

  it("nullValidator", () => {
    const message = "invalid_type_null";

    expect(nullValidator(null, {})).toBeUndefined();
    expect(nullValidator(undefined, {})).toStrictEqual(message);
    expect(nullValidator("test", {})).toStrictEqual(message);
    expect(nullValidator(1, {})).toStrictEqual(message);
    expect(nullValidator(true, {})).toStrictEqual(message);
    expect(nullValidator(new Date(), {})).toStrictEqual(message);
  });

  it("dateValidator", () => {
    const message = "invalid_type_date";

    expect(dateValidator(new Date(), {})).toBeUndefined();
    expect(dateValidator(null, {})).toStrictEqual(message);
    expect(dateValidator(undefined, {})).toStrictEqual(message);
    expect(dateValidator("test", {})).toStrictEqual(message);
    expect(dateValidator(1, {})).toStrictEqual(message);
    expect(dateValidator(true, {})).toStrictEqual(message);
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

  it("emailValidator", () => {
    const typeMessage = "invalid_type_string";
    const valueMessage = "invalid_value_email";

    expect(emailValidator("test@email.com", {})).toBeUndefined();
    expect(emailValidator("test@email.co.uk", {})).toBeUndefined();
    expect(emailValidator("test@email.something.uk", {})).toBeUndefined();
    expect(emailValidator("test.name@email.something.com", {})).toBeUndefined();

    expect(emailValidator("test@invalid.123", {})).toStrictEqual(valueMessage);
    expect(emailValidator("not_email", {})).toStrictEqual(valueMessage);
    expect(emailValidator("", {})).toStrictEqual(valueMessage);

    expect(emailValidator(1, {})).toStrictEqual(typeMessage);
    expect(emailValidator(true, {})).toStrictEqual(typeMessage);
    expect(emailValidator(new Date(), {})).toStrictEqual(typeMessage);
    expect(emailValidator(null, {})).toStrictEqual(typeMessage);
    expect(emailValidator(undefined, {})).toStrictEqual(typeMessage);
  });
});
