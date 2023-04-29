import { NextFunction } from "express";

const ValidationErrorHandler: any = (error: any) => {
    const errors = Object.values(error.errors).map((el: any) => el.message);
    const message = `Invalid Input Data :  ${errors.join('. ')}`;
    return new Error(message);
  };


const Errdev: any = function(err: any,res: any){
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });

};

const ErrProd = (err: any, res: any) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'something went wrong!!!'
      });
    }
  }; 


const globalErrorHandler = (err: any, req: any, res: any, next: any) => {
  console.log('some error Occured', err)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development'){
        Errdev(err,res);
    }else if(process.env.NODE_ENV === 'production'){
        if (err.name === 'ValidationError') err = ValidationErrorHandler(err);
        ErrProd(err, res);
    }
};

const requestHandler = async (calledFunction: any, res: any, next: NextFunction, ...args: any) => {
  try {
      let result = await calledFunction(...args)
      return result;
  } catch(err) {
    
    next(err);
  }
}


const catchAsync = (fn: any) => {
  return (req:any, res: any, next: NextFunction) => {
      fn(req, res, next).catch((err: any) => { console.log('---------------an error occured----------------'); return next(err)})
  }
}

export  {globalErrorHandler, requestHandler, catchAsync}