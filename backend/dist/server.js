"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const start = async () => {
    await (0, db_1.connectDb)();
    const PORT = process.env.PORT || env_1.env.port || 5000;
    app_1.app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
start();
