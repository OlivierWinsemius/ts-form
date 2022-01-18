"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormError = void 0;
class FormError extends Error {
    constructor(fieldErrors) {
        super(Object.entries(fieldErrors)
            .flatMap(([fieldName, errors]) => [fieldName, errors.map((e) => `\t- ${e}`).join("\n")].join(":\n"))
            .join("\n"));
        this.name = "FormError";
    }
}
exports.FormError = FormError;
