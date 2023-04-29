import CustomError from "../utils/error";
import { ResponseBodyWrapper } from "../utils/ResponseWrapper";
import { MatrixModel } from "../models/matrixModel";
import { initialSeatConfiguration } from "../contants/bookingConstants";


class Booking {
    private matrixModel: any
    customError: any;
    matrix: any
    constructor() {
        this.customError = new CustomError()
        this.matrixModel = MatrixModel
    }


    /**
     * @description To get Available Seats
     * @returns 
     */
    async getsAvailableSeats() {
        let seatInformation: any  = await this.matrixModel.find({couchNumber: '0'});
        if(!seatInformation.length) {
            await this.upsertSeats(initialSeatConfiguration, 80);
            return ResponseBodyWrapper(200, 'Available Seats', [{seats: initialSeatConfiguration}]);
        }
        return ResponseBodyWrapper(200, 'Available Seats', [{seats: seatInformation[0].seats}]);
    }


    /**
     * @description To set seats data to default value
     */
    async resetSeats() {
        await this.upsertSeats(initialSeatConfiguration,80);
        return ResponseBodyWrapper(200, 'All Booking Cleared', [{seats: initialSeatConfiguration}]);
    }


    /**
     * @description To Update the SeatInformation
     */
    async upsertSeats(grid: any, totalAvailable: number=80) {
        try {
            await this.matrixModel.findOneAndUpdate({ couchNumber: '0' }, { couchNumber: '0', seats: grid, totalAvailable: totalAvailable }, { upsert: true });
            return 
        } catch(err: any) {
            throw new Error(err);
        }
    }

    /**
     * @description To Book The desired Number of seats
     */
    async bookSeats(noOfSeats: number = 0) {
        if(noOfSeats<1 || noOfSeats>7) {
            this.customError.badRequest('Maximum of 7 seats can be booked at a time')
        }
        let seatsInfomation: any = await this.matrixModel.find({couchNumber:'0', totalAvailable: {$gte: noOfSeats}})
        if(!seatsInfomation.length) {
            return this.customError.badRequest(`Less than ${noOfSeats} are available for booking`)
        }
        let seatsToBeBooked = this.getSeatsToBeBooked(seatsInfomation[0].seats, noOfSeats);
        for(let seat of seatsToBeBooked) {
            let [i,j] = seat;
            seatsInfomation[0].seats[i][j] = 1
        }
        await this.upsertSeats(seatsInfomation[0].seats, seatsInfomation[0].totalAvailable-noOfSeats);
        return ResponseBodyWrapper(200, 'Seats Booked', [{booked: seatsToBeBooked, seats: seatsInfomation[0].seats}])
    }


    /**
     * @description To get Seat details to be booked (used BFS technique); will check for row first if the row as desired number of seats then it will return other wise book desired seats closest to a particular seat
     */
    getSeatsToBeBooked(grid: any, noOfSeats: number) {
        let visitedMap = new Map()
        let seatMap = new Map()
        for (let i = 0; i < 12; i++) {
            let lst: any = []
            for (let j = 0; j < 7; j++) {
                if (grid[i][j] == 0) {
                    lst.push([i, j])
                }
            }
            if (lst.length >= noOfSeats) {
                return lst.slice(0, noOfSeats);
            }
            seatMap.set(i, { lst: lst, available: lst.length })
        }
        let resultObj: any = { closest: 30, seats: [] };
        for (let [row, data] of seatMap) {
            let newLst = [...data.lst]

            while (newLst.length) {
                let breakCounter: number = noOfSeats - 1
                let node = newLst.shift();
                visitedMap = new Map()
                let lst = [node];
                let resultLst = [node]
                visitedMap.set(`${node[0]}-${node[1]}`, 1);
                let distance = 0
                for (let k = 0; k < lst.length; k++) {
                    distance++
                    let [i, j] = lst[k];

                    if (!visitedMap.has(`${i + 1}-${j}`) && this.checkIndex(grid, i + 1, j)) {
                        lst.push([i + 1, j])
                        if (grid[i + 1][j] == 0) {
                            resultLst.push([i + 1, j])
                            breakCounter--;
                            if (breakCounter == 0) {
                                break
                            }
                        }
                    }
                    if (!visitedMap.has(`${i - 1}-${j}`) && this.checkIndex(grid, i - 1, j)) {
                        lst.push([i - 1, j])
                        if (grid[i - 1][j] == 0) {
                            resultLst.push([i - 1, j])
                            breakCounter--;
                            if (breakCounter == 0) {
                                break
                            }
                        }
                    }
                    if (!visitedMap.has(`${i}-${j + 1}`) && this.checkIndex(grid, i, j + 1)) {
                        lst.push([i, j + 1])
                        if (grid[i][j + 1] == 0) {
                            resultLst.push([i, j + 1])
                            breakCounter--;
                            if (breakCounter == 0) {
                                break
                            }
                        }
                    }
                    if (!visitedMap.has(`${i}-${j - 1}`) && this.checkIndex(grid, i, j - 1)) {
                        lst.push([i, j - 1])
                        if (grid[i][j - 1] == 0) {
                            resultLst.push([i, j - 1])
                            breakCounter--;
                            if (breakCounter == 0) {
                                break
                            }
                        }
                    }
                }
                if (resultObj.closest > distance) {
                    resultObj.closest = distance
                    resultObj.seats = lst;
                }
            }
        }
        return resultObj.seats;
    }

    /**
     * @description To check index out of bound
     */
    checkIndex(grid: any, i: number, j: number) {
        if (grid[i] && grid[j] && grid[i][j] != undefined) {
            return true
        }
        return false;
    }

}

export default Booking

