import { Form } from "form";

describe("testing form", () => {
  const form = new Form({ values: {} });

  it("test", () => {
    expect(form).toBeInstanceOf(Form);
  });
});
