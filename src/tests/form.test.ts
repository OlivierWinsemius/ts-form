import { Form } from "form";

describe("form", () => {
  it("reset", () => {
    const onSubmit = jest.fn();
    const values = { fieldName: 1 };
    const form = new Form({ values, onSubmit })
    const formField = form.getField("fieldName")

    expect(formField.value).toStrictEqual(values.fieldName)
    
    formField.setValue(2);
    expect(formField.isTouched).toStrictEqual(true)
    expect(formField.value).not.toStrictEqual(values.fieldName)
    form.reset();
    
    expect(formField.isTouched).toStrictEqual(false)
    expect(formField.value).toStrictEqual(values.fieldName)
  })

  describe("validators", () => {
    it("valid validator calls onSubmit", async () => {
      const onSubmit = jest.fn()
      const values = { fieldName: 1 };
      const form = new Form({
        values,
        onSubmit,
        validators: { fieldName: (v)=> v.number() }
      });

      await expect(form.submit()).resolves.toBeUndefined()
      expect(onSubmit).toBeCalled();
    })

    it("invalid validator throws error", async () => {
      const onSubmit = jest.fn();
      const values = { fieldName: 1 };
      const form = new Form({
        values,
        onSubmit,
        validators: { fieldName: (v) => v.string() }
      });
  
      await expect(form.submit()).rejects.toThrowError("fieldName:\n\t- invalid_type_string");
      expect(onSubmit).not.toBeCalled();
    })
  });

  it("changing input value does not affect form", () => {
    const onSubmit = jest.fn();
    const values = { fieldName: 1 };
    const form = new Form({ values, onSubmit })
    const formField = form.getField("fieldName")

    expect(formField.value).toStrictEqual(values.fieldName)

    values.fieldName = 3;
    expect(formField.value).not.toStrictEqual(values.fieldName)
    
    form.reset();
    expect(formField.value).not.toStrictEqual(values.fieldName)
  });

  it("changing form values updates fieldErrors", async () => {
    const onSubmit = jest.fn();
    const values = { fieldName: 1 };
    const form = new Form({ values, onSubmit, validators: { fieldName: v => v.minNumber(10) } });

    const field = form.getField("fieldName");

    await field.setValue(0);
    expect(field.errors).toStrictEqual(['invalid_value_min_number']);
    expect(field.isValid).toStrictEqual(false);
    expect(form.isValid).toStrictEqual(false);
    
    
    await field.setValue(20);
    expect(field.errors).toStrictEqual([]);
    expect(field.isValid).toStrictEqual(true);
    expect(form.isValid).toStrictEqual(true);
  })
});
