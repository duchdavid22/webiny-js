import mysql from "mysql";

const { WEBINY_ENV, IS_OFFLINE } = process.env;

let config = {
    host: "localhost",
    port: 32768,
    user: "root",
    password: "dev",
    database: "webiny",
    timezone: "Z",
    connectionLimit: 100
};

if (WEBINY_ENV === "lambda-production" && !IS_OFFLINE) {
    config = {
        host: "webiny.c8xvs8v5ria6.eu-west-1.rds.amazonaws.com",
        port: 3306,
        user: "webiny",
        password: "yM+rQ#LX9D?oazU4",
        database: "webiny",
        timezone: "Z",
        connectionLimit: 10
    };
}

const connection = mysql.createPool(config);

export { connection };
