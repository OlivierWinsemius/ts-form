import { Form } from "form";

describe("testing form", () => {
  it("hey", () => {
    expect(new Form()).toBeInstanceOf(Form);
  });
});
