import mongoose from "mongoose";

let schema = new mongoose.Schema({
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

let MatrixModel = mongoose.model('couch', schema);
export {MatrixModel};