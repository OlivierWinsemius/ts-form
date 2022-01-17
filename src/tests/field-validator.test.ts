import { ActionableFieldValidator, FieldValidator } from "../field-validator";
import { Form } from "../form";
import { FormValues } from "../utils/types";

describe("FieldValidator", () => {
  const onSubmit = jest.fn();

  type Test = [
    unknown,
    <V extends FormValues>(
      validator: FieldValidator<V, keyof V>
    ) => FieldValidator<V, keyof V>,
    string[]
  ];

  const date2000 = new Date("2000-01-01");
  const date2020 = new Date("2020-01-01");
  const date2040 = new Date("2040-01-01");

  const tests: Test[] = [
    [5, (v) => v.number(), []],
    ["test", (v) => v.number(), ["invalid_type_number"]],
    [null, (v) => v.number(), ["invalid_type_number"]],
    [undefined, (v) => v.number(), ["invalid_type_number"]],

    [null, (v) => v.number().nullable(), []],
    [5, (v) => v.number().nullable(), []],
    ["test", (v) => v.number().nullable(), ["invalid_type_number"]],

    [undefined, (v) => v.number().maybe(), []],
    [5, (v) => v.number().maybe(), []],
    ["test", (v) => v.number().maybe(), ["invalid_type_number"]],

    ["test", (v) => v.string(), []],
    [5, (v) => v.string(), ["invalid_type_string"]],

    [date2020, (v) => v.date(), []],
    [5, (v) => v.date(), ["invalid_type_date"]],

    [true, (v) => v.boolean(), []],
    [5, (v) => v.boolean(), ["invalid_type_boolean"]],

    [true, (v) => v.custom(() => undefined), []],
    [5, (v) => v.custom(() => "custom_error"), ["custom_error"]],

    [5, (v) => v.minNumber(0), []],
    [5, (v) => v.minNumber(10), ["invalid_value_min_number"]],

    [5, (v) => v.maxNumber(10), []],
    [5, (v) => v.maxNumber(0), ["invalid_value_max_number"]],

    [date2020, (v) => v.minDate(date2000), []],
    [date2020, (v) => v.minDate(date2040), ["invalid_value_min_date"]],

    [date2020, (v) => v.maxDate(date2040), []],
    [date2020, (v) => v.maxDate(date2000), ["invalid_value_max_date"]],

    ["test", (v) => v.oneOf(v.string, v.number), []],
    [
      false,
      (v) => v.oneOf(v.string, v.number),
      ["invalid_type_string / invalid_type_number"],
    ],
  ];

  it.each(tests)("%j", async (value, setValidations, result) => {
    const form = new Form({ values: { value: value }, onSubmit });

    const fieldValidator = new ActionableFieldValidator(form, "value");
    setValidations(fieldValidator);

    await fieldValidator.validate();
    expect(fieldValidator.errors).toStrictEqual(result);
  });
});
