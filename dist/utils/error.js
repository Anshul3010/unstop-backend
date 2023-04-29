"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError {
    constructor() {
    }
    badRequest(message = '') {
        return {
            code: 400,
            status: 'ERROR',
            message: message ? message : 'Bad Request'
        };
    }
    forbidden() {
        return {
            code: 403,
            status: 'ERROR',
            message: 'Access to Resource Blocked, Please contact admin'
        };
    }
    unAuthorized() {
        return {
            code: 401,
            status: 'ERROR',
            message: 'Invalid Credentials'
        };
    }
    internalServerError() {
        return {
            code: 502,
            status: 'ERROR',
            message: 'Internal Server Error'
        };
    }
    duplicateError() {
        return {
            code: 409,
            status: "ERROR",
            message: "Record Already Exists"
        };
    }
}
exports.default = CustomError;
