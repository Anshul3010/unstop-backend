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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connection_1 = require("./connection");
const globalErrorHandler_1 = require("./utils/globalErrorHandler");
const booking_1 = __importDefault(require("./routes/booking"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(body_parser_1.default.json());
app.use('/v1/api', booking_1.default);
app.use('**', (req, res) => {
    res.status(404).json({
        status: 'ERROR',
        message: "Route Not Found"
    });
});
const server = http_1.default.createServer(app);
app.use(globalErrorHandler_1.globalErrorHandler);
server.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000, () => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    yield (0, connection_1.db)();
    console.log(`server is listening to port ${(_b = process.env.PORT) !== null && _b !== void 0 ? _b : 3000}`);
}));
exports.default = app;
