const mongoose = require('mongoose');
const mongoConnectionString = process.env.CONNECTION_STRING;
export function db() {
    return mongoose.connect(mongoConnectionString, {
    }).then(() => {
        console.log('Connection Successful');
    }).catch((err: any) => {
        console.log(`Failed to Connect`);
    });
}