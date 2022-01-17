import { ActionableFieldValidator, FieldValidator } from "field-validator"
import { Form } from "form";
import { FormValues } from "utils/types";

describe("FieldValidator", () => {
  const onSubmit = jest.fn();
    
    type Test = [unknown, <V extends FormValues>(validator: FieldValidator<V, keyof V>) => FieldValidator<V, keyof V>, string[]]
    const tests: Test[] = [
      [5, (v) => v.number(), []],
      [5, v => v.maxNumber(10), []],

      [undefined, v => v.string().maybe(), []],
      // eslint-disable-next-line unicorn/no-null
      [null, v => v.number().nullable(), []],

      [5, v => v.string(), ['invalid_type_string']],
      [5, v => v.date(), ['invalid_type_date']],
      [5, v => v.boolean(), ['invalid_type_boolean']],
      [5, v => v.custom(() => "custom_error"), ['custom_error']],

      [5, v => v.minNumber(10), ['invalid_value_min_number']],
      [5, v => v.minNumber(0), []],
      [5, v => v.maxNumber(0), ['invalid_value_max_number']],
      [5, v => v.maxNumber(10), []],

      [new Date("2020-01-01"), v => v.minDate(new Date("2040-01-01")), ['invalid_value_min_date']],
      [new Date("2020-01-01"), v => v.minDate(new Date("2000-01-01")), []],
      [new Date("2020-01-01"), v => v.maxDate(new Date("2000-01-01")), ['invalid_value_max_date']],
      [new Date("2020-01-01"), v => v.maxDate(new Date("2040-01-01")), []],
    ]

    it.each(tests)("%j", async (value, setValidations, result) => {
      const form = new Form({ values: { value: value }, onSubmit })
      
      const fieldValidator = new ActionableFieldValidator(form, "value");
      setValidations(fieldValidator);
      
      await fieldValidator.validate();
      expect(fieldValidator.errors).toStrictEqual(result);
    })
})
