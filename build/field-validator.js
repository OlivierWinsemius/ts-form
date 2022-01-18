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
    constructor(form, fieldName) {
        super();
        this.validate = (formValues) => __awaiter(this, void 0, void 0, function* () {
            const { form, fieldName, validators, allowNull, allowUndefined } = this;
            const value = form.getFieldValue(fieldName);
            if ((allowUndefined && value === undefined) ||
                (allowNull && value === null)) {
                return [];
            }
            const errorValidations = yield Promise.all(validators.map((validate) => validate(value, formValues)));
            const errors = new Set(errorValidations.filter((message) => !!message));
            if (allowUndefined && errors.size === 1) {
                errors.delete("invalid_type_undefined");
            }
            if (allowNull && errors.size === 1) {
                errors.delete("invalid_type_null");
            }
            return [...errors];
        });
        this.fieldName = fieldName;
        this.form = form;
    }
}
exports.FormFieldValidator = FormFieldValidator;
