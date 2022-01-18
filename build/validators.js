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
exports.oneOf = exports.maxDateValidator = exports.minDateValidator = exports.maxNumberValidator = exports.minNumberValidator = exports.dateValidator = exports.nullValidator = exports.undefinedValidator = exports.booleanValidator = exports.numberValidator = exports.stringValidator = exports.truthyValidator = void 0;
const truthyValidator = (fieldValue) => !fieldValue ? "invalid_value_truthy" : undefined;
exports.truthyValidator = truthyValidator;
const typeValidator = (type) => (fieldValue) => type !== typeof fieldValue ? `invalid_type_${type}` : undefined;
exports.stringValidator = typeValidator("string");
exports.numberValidator = typeValidator("number");
exports.booleanValidator = typeValidator("boolean");
exports.undefinedValidator = typeValidator("undefined");
const nullValidator = (fieldValue) => fieldValue !== null ? "invalid_type_null" : undefined;
exports.nullValidator = nullValidator;
const dateValidator = (fieldValue) => !(fieldValue instanceof Date) ? "invalid_type_date" : undefined;
exports.dateValidator = dateValidator;
const minValueValidator = (minValue, type) => (fieldValue) => fieldValue < minValue ? `invalid_value_min_${type}` : undefined;
const maxValueValidator = (maxValue, type) => (fieldValue) => fieldValue > maxValue ? `invalid_value_max_${type}` : undefined;
const minNumberValidator = (minValue) => (fieldValue, formValues) => {
    var _a;
    return (_a = typeValidator("number")(fieldValue, formValues)) !== null && _a !== void 0 ? _a : minValueValidator(minValue, "number")(fieldValue, formValues);
};
exports.minNumberValidator = minNumberValidator;
const maxNumberValidator = (maxValue) => (fieldValue, formValues) => {
    var _a;
    return (_a = typeValidator("number")(fieldValue, formValues)) !== null && _a !== void 0 ? _a : maxValueValidator(maxValue, "number")(fieldValue, formValues);
};
exports.maxNumberValidator = maxNumberValidator;
const minDateValidator = (minValue) => (fieldValue, formValues) => {
    var _a;
    return (_a = (0, exports.dateValidator)(fieldValue, formValues)) !== null && _a !== void 0 ? _a : minValueValidator(minValue, "date")(fieldValue, formValues);
};
exports.minDateValidator = minDateValidator;
const maxDateValidator = (maxValue) => (fieldValue, formValues) => {
    var _a;
    return (_a = (0, exports.dateValidator)(fieldValue, formValues)) !== null && _a !== void 0 ? _a : maxValueValidator(maxValue, "date")(fieldValue, formValues);
};
exports.maxDateValidator = maxDateValidator;
const oneOf = (...validators) => (fieldValue, formValues) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = [];
    for (const validator of validators) {
        const validatorMessage = yield validator(fieldValue, formValues);
        if (!validatorMessage) {
            return;
        }
        messages.push(validatorMessage);
    }
    return messages.join(" / ");
});
exports.oneOf = oneOf;
