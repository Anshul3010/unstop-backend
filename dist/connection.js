"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose = require('mongoose');
const mongoConnectionString = process.env.CONNECTION_STRING;
function db() {
    return mongoose.connect(mongoConnectionString, {}).then(() => {
        console.log('Connection Successful');
    }).catch((err) => {
        console.log(`Failed to Connect`);
    });
}
exports.db = db;
