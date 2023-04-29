"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let schema = new mongoose_1.default.Schema({
    couchNumber: {
        type: String,
        default: '0'
    },
    seats: {
        type: [[Number]]
    },
    totalAvailable: {
        type: Number,
        default: 80
    }
});
let MatrixModel = mongoose_1.default.model('couch', schema);
exports.MatrixModel = MatrixModel;
