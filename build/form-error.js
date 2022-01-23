"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormError = void 0;
class FormError extends Error {
    constructor(formErrors) {
        super(Object.entries(formErrors)
            .flatMap(([fieldName, errors]) => [fieldName, errors.map((e) => `\t- ${e}`).join("\n")].join(":\n"))
            .join("\n"));
        this.name = "FormError";
        this.formErrors = formErrors;
    }
}
exports.FormError = FormError;
