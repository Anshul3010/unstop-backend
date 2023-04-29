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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_1 = __importDefault(require("../controllers/booking"));
const globalErrorHandler_1 = require("../utils/globalErrorHandler");
const router = (0, express_1.Router)();
router.route('/seats').get((0, globalErrorHandler_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let bookingService = new booking_1.default();
    let result = yield bookingService.getsAvailableSeats();
    return res.status(result.code).json(result);
}))).post((0, globalErrorHandler_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let bookingService = new booking_1.default();
    let { seatCount } = req.body;
    let result = yield bookingService.bookSeats(seatCount);
    return res.status(result.code).json(result);
}))).put((0, globalErrorHandler_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let bookingService = new booking_1.default();
    let result = yield bookingService.resetSeats();
    return res.status(result.code).json(result);
})));
exports.default = router;
