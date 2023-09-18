"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
const form_error_1 = require("./form-error");
const field_validator_1 = require("./field-validator");
const clone_object_1 = require("./clone-object");
const emptyEvent = () => undefined;
class Form {
    constructor({ values, onSubmit, validators, events, }) {
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
            return this.formSubmitState.isSubmitting;
        };
        this.getIsSubmitted = () => {
            return this.formSubmitState.isSubmitted;
        };
        this.getIsTouched = () => {
            return !!this.fieldNames.find((field) => this.getIsFieldTouched(field));
        };
        this.getIsValid = () => {
            return Object.values(this.formErrors).flat().length === 0;
        };
        this.validateField = async (field) => {
            const { validate } = this.formValidators[field];
            this.formErrors[field] = await validate(this.formValues, field);
            this.formEvents.afterValidate(field, this);
        };
        this.validateAllFields = async () => {
            let isInvalid = false;
            for (const field of this.fieldNames) {
                const { validate } = this.formValidators[field];
                const errors = await validate(this.formValues, field);
                this.formErrors[field] = errors;
                isInvalid = isInvalid || errors.length > 0;
            }
            return !isInvalid;
        };
        this.setFieldValue = (field, value) => {
            if (this.formSubmitState.isSubmitting) {
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
        this.submit = async () => {
            if (this.formSubmitState.isSubmitting) {
                return;
            }
            this.formSubmitState = { isSubmitted: false, isSubmitting: true };
            this.formEvents.beforeSubmit(this);
            try {
                const isValid = await this.validateAllFields();
                if (!isValid) {
                    throw new form_error_1.FormError(this.formErrors);
                }
                await this.onSubmit(this.formValues, this);
                this.formSubmitState.isSubmitted = true;
            }
            finally {
                this.formSubmitState.isSubmitting = false;
                this.formEvents.afterSubmit(this);
            }
        };
        this.reset = async () => {
            this.formValues = { ...this.initialFormValues };
            this.formSubmitState = {};
            await this.validateAllFields();
            this.formEvents.afterReset(this);
        };
        this.initialFormValues = { ...values };
        this.formValues = { ...values };
        this.fieldNames = Object.keys(values);
        this.formSubmitState = {};
        this.formEvents = events !== null && events !== void 0 ? events : {
            afterReset: emptyEvent,
            beforeSubmit: emptyEvent,
            afterSubmit: emptyEvent,
            afterValidate: emptyEvent,
        };
        this.onSubmit = onSubmit;
        this.formErrors = (0, clone_object_1.cloneObjectWithDefaultValue)(this.formValues, () => []);
        this.formValidators = (0, clone_object_1.cloneObjectWithDefaultValue)(this.formValues, (key) => {
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
