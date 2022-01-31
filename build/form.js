"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
const form_error_1 = require("./form-error");
const field_validator_1 = require("./field-validator");
const object_from_keys_1 = require("./object-from-keys");
class Form {
    constructor({ values, onSubmit, validators, afterReset = () => undefined, afterSubmit = () => undefined, afterValidate = () => undefined, beforeSubmit = () => undefined, }) {
        this.isFormSubmitting = false;
        this.isFormSubmitted = false;
        this.getFieldValue = (field) => {
            return this.formValues[field];
        };
        this.getFieldErrors = (field) => {
            return this.formErrors[field];
        };
        this.getIsFieldTouched = (field) => {
            return this.formValues[field] !== this.initialFormValues[field];
        };
        this.getIsSubmitting = () => {
            return this.isFormSubmitting;
        };
        this.getIsSubmitted = () => {
            return this.isFormSubmitted;
        };
        this.getIsTouched = () => {
            const { fieldNames, getIsFieldTouched } = this;
            return !!fieldNames.find((field) => getIsFieldTouched(field));
        };
        this.getIsValid = () => {
            return Object.values(this.formErrors).flat().length === 0;
        };
        this.validateField = (field) => __awaiter(this, void 0, void 0, function* () {
            const { formValues, formValidators } = this;
            const { validate } = formValidators[field];
            this.formErrors[field] = yield validate(formValues, field);
            this.afterValidate(field, this);
        });
        this.validateAllFields = () => __awaiter(this, void 0, void 0, function* () {
            const { formValues, formValidators, fieldNames } = this;
            let isInvalid = false;
            for (const field of fieldNames) {
                const { validate } = formValidators[field];
                const errors = yield validate(formValues, field);
                this.formErrors[field] = errors;
                isInvalid = isInvalid || errors.length > 0;
            }
            return !isInvalid;
        });
        this.setFieldValue = (field, value) => {
            if (this.isFormSubmitting) {
                return Promise.resolve();
            }
            this.formValues[field] = value;
            return this.validateField(field);
        };
        this.getField = (field) => {
            const { getIsFieldTouched, getFieldErrors, getFieldValue, setFieldValue } = this;
            return {
                get errors() {
                    return getFieldErrors(field);
                },
                get isValid() {
                    return getFieldErrors(field).length === 0;
                },
                get isTouched() {
                    return getIsFieldTouched(field);
                },
                get value() {
                    return getFieldValue(field);
                },
                setValue(value) {
                    return setFieldValue(field, value);
                },
            };
        };
        this.submit = () => __awaiter(this, void 0, void 0, function* () {
            const { validateAllFields, onSubmit, afterSubmit, formValues, isFormSubmitting, } = this;
            if (isFormSubmitting) {
                return;
            }
            this.isFormSubmitted = false;
            this.isFormSubmitting = true;
            this.beforeSubmit(this);
            try {
                const isValid = yield validateAllFields();
                if (!isValid) {
                    throw new form_error_1.FormError(this.formErrors);
                }
                yield onSubmit(formValues, this);
                this.isFormSubmitted = true;
            }
            finally {
                this.isFormSubmitting = false;
                afterSubmit(this);
            }
        });
        this.reset = () => __awaiter(this, void 0, void 0, function* () {
            this.formValues = Object.assign({}, this.initialFormValues);
            this.isFormSubmitting = false;
            this.isFormSubmitted = false;
            yield this.validateAllFields();
            this.afterReset(this);
        });
        this.initialFormValues = Object.assign({}, values);
        this.formValues = Object.assign({}, values);
        this.fieldNames = Object.keys(values);
        this.onSubmit = onSubmit;
        this.afterReset = afterReset;
        this.afterSubmit = afterSubmit;
        this.afterValidate = afterValidate;
        this.beforeSubmit = beforeSubmit;
        this.formErrors = (0, object_from_keys_1.cloneObjectWithDefaultValue)(this.formValues, () => []);
        this.formValidators = (0, object_from_keys_1.cloneObjectWithDefaultValue)(this.formValues, (key) => {
            var _a;
            const validator = new field_validator_1.FormFieldValidator();
            (_a = validators === null || validators === void 0 ? void 0 : validators[key]) === null || _a === void 0 ? void 0 : _a.call(validators, validator);
            return validator;
        });
        this.reset();
    }
    get isValid() {
        return this.getIsValid();
    }
    get isTouched() {
        return this.getIsTouched();
    }
    get isSubmitting() {
        return this.getIsSubmitting();
    }
    get isSubmitted() {
        return this.getIsSubmitted();
    }
}
exports.Form = Form;
