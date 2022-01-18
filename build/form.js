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
    constructor({ values, onSubmit, validators }) {
        this.afterValidateField = (_) => { };
        this.reset = () => {
            const { initialValues } = this;
            this.values = Object.assign({}, initialValues);
            this.touchedFields = (0, object_from_keys_1.objectFromKeys)(initialValues, () => false);
            this.fieldErrors = (0, object_from_keys_1.objectFromKeys)(initialValues, () => []);
        };
        this.getFieldValue = (field) => {
            return this.values[field];
        };
        this.getFieldErrors = (field) => {
            return this.fieldErrors[field];
        };
        this.getFieldIsTouched = (field) => {
            return !!this.touchedFields[field];
        };
        this.validateField = (field) => __awaiter(this, void 0, void 0, function* () {
            this.fieldErrors[field] = yield this.validators[field].validate();
            yield this.afterValidateField(field);
        });
        this.setFieldValue = (field, value) => __awaiter(this, void 0, void 0, function* () {
            this.values[field] = value;
            this.touchedFields[field] = true;
            yield this.validateField(field);
        });
        this.getField = (field) => {
            const { getFieldIsTouched, getFieldErrors, getFieldValue, setFieldValue } = this;
            return {
                get errors() {
                    return getFieldErrors(field);
                },
                get isValid() {
                    return getFieldErrors(field).length === 0;
                },
                get isTouched() {
                    return getFieldIsTouched(field);
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
            yield Promise.all(this.fieldNames.map(this.validateField));
            if (!this.isValid) {
                throw new form_error_1.FormError(this.fieldErrors);
            }
            return this.onSubmit(this.values);
        });
        this.initialValues = Object.assign({}, values);
        this.values = Object.assign({}, values);
        this.fieldNames = Object.keys(values);
        this.onSubmit = onSubmit;
        this.touchedFields = (0, object_from_keys_1.objectFromKeys)(values, () => false);
        this.fieldErrors = (0, object_from_keys_1.objectFromKeys)(values, () => []);
        this.validators = (0, object_from_keys_1.objectFromKeys)(values, (key) => {
            var _a;
            const validator = new field_validator_1.FormFieldValidator(this, key);
            (_a = validators === null || validators === void 0 ? void 0 : validators[key]) === null || _a === void 0 ? void 0 : _a.call(validators, validator);
            return validator;
        });
        this.fieldNames.map(this.validateField);
    }
    get isValid() {
        return Object.values(this.fieldErrors).every((v) => v.length === 0);
    }
}
exports.Form = Form;
