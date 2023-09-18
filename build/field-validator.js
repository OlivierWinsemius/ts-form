"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormFieldValidator = exports.FieldValidator = void 0;
const validators_1 = require("./validators");
class FieldValidator {
    constructor() {
        this.allowUndefined = false;
        this.allowNull = false;
        this.validators = [];
        this.custom = (validator) => {
            this.validators.push(validator);
            return this;
        };
        this.truthy = () => {
            this.validators.push(validators_1.truthyValidator);
            return this;
        };
        this.string = () => {
            this.validators.push(validators_1.stringValidator);
            return this;
        };
        this.email = () => {
            this.validators.push(validators_1.emailValidator);
            return this;
        };
        this.number = () => {
            this.validators.push(validators_1.numberValidator);
            return this;
        };
        this.boolean = () => {
            this.validators.push(validators_1.booleanValidator);
            return this;
        };
        this.date = () => {
            this.validators.push(validators_1.dateValidator);
            return this;
        };
        this.minNumber = (min) => {
            this.validators.push((0, validators_1.minNumberValidator)(min));
            return this;
        };
        this.maxNumber = (max) => {
            this.validators.push((0, validators_1.maxNumberValidator)(max));
            return this;
        };
        this.minDate = (min) => {
            this.validators.push((0, validators_1.minDateValidator)(min));
            return this;
        };
        this.maxDate = (max) => {
            this.validators.push((0, validators_1.maxDateValidator)(max));
            return this;
        };
        this.oneOf = (...validators) => {
            validators.forEach((v) => v());
            const validations = this.validators.splice(-validators.length);
            this.validators.push((0, validators_1.oneOf)(...validations));
            return this;
        };
        this.maybe = () => {
            this.allowUndefined = true;
            this.validators.push(validators_1.undefinedValidator);
            return this;
        };
        this.nullable = () => {
            this.allowNull = true;
            this.validators.push(validators_1.nullValidator);
            return this;
        };
    }
}
exports.FieldValidator = FieldValidator;
class FormFieldValidator extends FieldValidator {
    constructor() {
        super(...arguments);
        this.shouldValidate = (value) => {
            if (value === undefined) {
                return !this.allowUndefined;
            }
            if (value === null) {
                return !this.allowNull;
            }
            return true;
        };
        this.cleanupErrors = (errors) => {
            const errorSet = new Set(errors);
            if (this.allowUndefined) {
                errorSet.delete("invalid_type_undefined");
            }
            if (this.allowNull) {
                errorSet.delete("invalid_type_null");
            }
            return [...errorSet];
        };
        this.getValidationErrors = async (value, formValues) => {
            const validationPromises = this.validators.map((v) => v(value, formValues));
            const validationMessages = await Promise.all(validationPromises);
            const messages = validationMessages.filter((m) => !!m);
            return this.cleanupErrors(messages);
        };
        this.validate = (formValues, fieldName) => {
            const value = formValues[fieldName];
            if (!this.shouldValidate(value)) {
                return Promise.resolve([]);
            }
            return this.getValidationErrors(value, formValues);
        };
    }
}
exports.FormFieldValidator = FormFieldValidator;
