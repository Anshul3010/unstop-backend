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
exports.catchAsync = exports.requestHandler = exports.globalErrorHandler = void 0;
const ValidationErrorHandler = (error) => {
    const errors = Object.values(error.errors).map((el) => el.message);
    const message = `Invalid Input Data :  ${errors.join('. ')}`;
    return new Error(message);
};
const Errdev = function (err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const ErrProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    else {
        res.status(500).json({
            status: 'error',
            message: 'something went wrong!!!'
        });
    }
};
const globalErrorHandler = (err, req, res, next) => {
    console.log('some error Occured', err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        Errdev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        if (err.name === 'ValidationError')
            err = ValidationErrorHandler(err);
        ErrProd(err, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
const requestHandler = (calledFunction, res, next, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield calledFunction(...args);
        return result;
    }
    catch (err) {
        next(err);
    }
});
exports.requestHandler = requestHandler;
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => { console.log('---------------an error occured----------------'); return next(err); });
    };
};
exports.catchAsync = catchAsync;
