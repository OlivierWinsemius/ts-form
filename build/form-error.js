"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormError = void 0;
class FormError extends Error {
    constructor(message) {
        super(message);
        this.name = "FormError";
    }
}
exports.FormError = FormError;
