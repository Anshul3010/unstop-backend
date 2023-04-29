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
const error_1 = __importDefault(require("../utils/error"));
const ResponseWrapper_1 = require("../utils/ResponseWrapper");
const matrixModel_1 = require("../models/matrixModel");
const bookingConstants_1 = require("../contants/bookingConstants");
class Booking {
    constructor() {
        this.customError = new error_1.default();
        this.matrixModel = matrixModel_1.MatrixModel;
    }
    /**
     * @description To get Available Seats
     * @returns
     */
    getsAvailableSeats() {
        return __awaiter(this, void 0, void 0, function* () {
            let seatInformation = yield this.matrixModel.find({ couchNumber: '0' });
            if (!seatInformation.length) {
                yield this.upsertSeats(bookingConstants_1.initialSeatConfiguration, 80);
                return (0, ResponseWrapper_1.ResponseBodyWrapper)(200, 'Available Seats', [{ seats: bookingConstants_1.initialSeatConfiguration }]);
            }
            return (0, ResponseWrapper_1.ResponseBodyWrapper)(200, 'Available Seats', [{ seats: seatInformation[0].seats }]);
        });
    }
    /**
     * @description To set seats data to default value
     */
    resetSeats() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.upsertSeats(bookingConstants_1.initialSeatConfiguration, 80);
            return (0, ResponseWrapper_1.ResponseBodyWrapper)(200, 'All Booking Cleared', [{ seats: bookingConstants_1.initialSeatConfiguration }]);
        });
    }
    /**
     * @description To Update the SeatInformation
     */
    upsertSeats(grid, totalAvailable = 80) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.matrixModel.findOneAndUpdate({ couchNumber: '0' }, { couchNumber: '0', seats: grid, totalAvailable: totalAvailable }, { upsert: true });
                return;
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    /**
     * @description To Book The desired Number of seats
     */
    bookSeats(noOfSeats = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (noOfSeats < 1 || noOfSeats > 7) {
                this.customError.badRequest('Maximum of 7 seats can be booked at a time');
            }
            let seatsInfomation = yield this.matrixModel.find({ couchNumber: '0', totalAvailable: { $gte: noOfSeats } });
            if (!seatsInfomation.length) {
                return this.customError.badRequest(`Less than ${noOfSeats} are available for booking`);
            }
            let seatsToBeBooked = this.getSeatsToBeBooked(seatsInfomation[0].seats, noOfSeats);
            for (let seat of seatsToBeBooked) {
                let [i, j] = seat;
                seatsInfomation[0].seats[i][j] = 1;
            }
            yield this.upsertSeats(seatsInfomation[0].seats, seatsInfomation[0].totalAvailable - noOfSeats);
            return (0, ResponseWrapper_1.ResponseBodyWrapper)(200, 'Seats Booked', [{ booked: seatsToBeBooked, seats: seatsInfomation[0].seats }]);
        });
    }
    /**
     * @description To get Seat details to be booked (used BFS technique); will check for row first if the row as desired number of seats then it will return other wise book desired seats closest to a particular seat
     */
    getSeatsToBeBooked(grid, noOfSeats) {
        let visitedMap = new Map();
        let seatMap = new Map();
        for (let i = 0; i < 12; i++) {
            let lst = [];
            for (let j = 0; j < 7; j++) {
                if (grid[i][j] == 0) {
                    lst.push([i, j]);
                }
            }
            if (lst.length >= noOfSeats) {
                return lst.slice(0, noOfSeats);
            }
            seatMap.set(i, { lst: lst, available: lst.length });
        }
        let resultObj = { closest: 30, seats: [] };
        for (let [row, data] of seatMap) {
            let newLst = [...data.lst];
            while (newLst.length) {
                let breakCounter = noOfSeats - 1;
                let node = newLst.shift();
                visitedMap = new Map();
                let lst = [node];
                let resultLst = [node];
                visitedMap.set(`${node[0]}-${node[1]}`, 1);
                let distance = 0;
                for (let k = 0; k < lst.length; k++) {
                    distance++;
                    let [i, j] = lst[k];
                    if (!visitedMap.has(`${i + 1}-${j}`) && this.checkIndex(grid, i + 1, j)) {
                        lst.push([i + 1, j]);
                        if (grid[i + 1][j] == 0) {
                            resultLst.push([i + 1, j]);
                            breakCounter--;
                            if (breakCounter == 0) {
                                break;
                            }
                        }
                    }
                    if (!visitedMap.has(`${i - 1}-${j}`) && this.checkIndex(grid, i - 1, j)) {
                        lst.push([i - 1, j]);
                        if (grid[i - 1][j] == 0) {
                            resultLst.push([i - 1, j]);
                            breakCounter--;
                            if (breakCounter == 0) {
                                break;
                            }
                        }
                    }
                    if (!visitedMap.has(`${i}-${j + 1}`) && this.checkIndex(grid, i, j + 1)) {
                        lst.push([i, j + 1]);
                        if (grid[i][j + 1] == 0) {
                            resultLst.push([i, j + 1]);
                            breakCounter--;
                            if (breakCounter == 0) {
                                break;
                            }
                        }
                    }
                    if (!visitedMap.has(`${i}-${j - 1}`) && this.checkIndex(grid, i, j - 1)) {
                        lst.push([i, j - 1]);
                        if (grid[i][j - 1] == 0) {
                            resultLst.push([i, j - 1]);
                            breakCounter--;
                            if (breakCounter == 0) {
                                break;
                            }
                        }
                    }
                }
                if (resultObj.closest > distance) {
                    resultObj.closest = distance;
                    resultObj.seats = lst;
                }
            }
        }
        return resultObj.seats;
    }
    /**
     * @description To check index out of bound
     */
    checkIndex(grid, i, j) {
        if (grid[i] && grid[j] && grid[i][j] != undefined) {
            return true;
        }
        return false;
    }
}
exports.default = Booking;
