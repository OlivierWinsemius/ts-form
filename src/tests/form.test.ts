import { Form } from "../form";

describe("form", () => {
  const onSubmit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("field > setValue", async () => {
    const form = new Form({ values: { value: 1 }, onSubmit });
    const field = form.getField("value");
    await field.setValue(2);
    expect(field.value).toStrictEqual(2);
  });

  it("reset", async () => {
    const form = new Form({ values: { value: 1 }, onSubmit });
    const field = form.getField("value");

    await field.setValue(2);
    expect(field.value).toStrictEqual(2);
    expect(form.isTouched).toStrictEqual(true);
    expect(field.isTouched).toStrictEqual(true);

    await form.reset();
    expect(field.value).toStrictEqual(1);
    expect(form.isTouched).toStrictEqual(false);
    expect(field.isTouched).toStrictEqual(false);
  });

  it("changing value while submitting has no effect", async () => {
    const form = new Form({ values: { value: 1 }, onSubmit });
    const field = form.getField("value");
    const submit = form.submit();
    expect(form.isSubmitting).toStrictEqual(true);
    expect(form.isSubmitted).toStrictEqual(false);
    await field.setValue(2);
    await submit;
    expect(field.value).toStrictEqual(1);
    expect(form.isSubmitting).toStrictEqual(false);
    expect(form.isSubmitted).toStrictEqual(true);
  });

  it("submitting while sumbitting does nothing", async () => {
    const form = new Form({ values: { value: 1 }, onSubmit });
    const submit = form.submit();
    await form.submit();
    await form.submit();
    await form.submit();
    await submit;
    expect(onSubmit).toBeCalledTimes(1);
  });

  it("isValid", async () => {
    const form = new Form({
      onSubmit,
      values: { value: 1 },
      validators: { value: (v) => v.minNumber(10) },
    });
    const field = form.getField("value");

    await field.setValue(0);
    expect(form.isValid).toStrictEqual(false);
    expect(field.isValid).toStrictEqual(false);

    await field.setValue(20);
    expect(form.isValid).toStrictEqual(true);
    expect(field.isValid).toStrictEqual(true);
  });

  it("invalid validator throws error", async () => {
    const form = new Form({
      onSubmit,
      values: { value: 1 },
      validators: { value: (v) => v.string() },
    });

    const field = form.getField("value");
    await field.setValue(1);

    expect(field.errors).toStrictEqual(["invalid_type_string"]);
    await expect(form.submit()).rejects.toThrowError(
      "value:\n\t- invalid_type_string"
    );
  });
});
