import {NextFunction, Router} from 'express'
import Booking from '../controllers/booking';
import { catchAsync} from '../utils/globalErrorHandler';

const router: any  = Router();

router.route('/seats').get(
    catchAsync(async (req: any, res: any, next: NextFunction) => {
        let bookingService = new Booking();
        let result: any = await bookingService.getsAvailableSeats()
        return res.status(result.code).json(result);
})
).post(
    catchAsync(async (req: any, res: any, next: NextFunction) => {
        let bookingService = new Booking();
        let {seatCount} = req.body;
        let result: any = await bookingService.bookSeats(seatCount);
        return res.status(result.code).json(result);
    })
).put(
    catchAsync(async (req: any, res: any, next: NextFunction) => {
        let bookingService = new Booking();
        let result: any = await bookingService.resetSeats()
        return res.status(result.code).json(result);
    })
)


export default router