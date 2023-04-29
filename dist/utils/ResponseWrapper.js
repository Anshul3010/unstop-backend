"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBodyWrapper = void 0;
const error_1 = __importDefault(require("./error"));
const ResponseBodyWrapper = (code, message = "", data = []) => {
    let customErrorHandler = new error_1.default();
    if (!code) {
        throw customErrorHandler.internalServerError();
    }
    return {
        code: code,
        status: "SUCCESS",
        message: message,
        data: data
    };
};
exports.ResponseBodyWrapper = ResponseBodyWrapper;
