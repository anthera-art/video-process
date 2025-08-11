import mysql from "mysql2/promise";
import Config from "../../Config.js";


var database = mysql.createPool({
    host: Config.DATABASE_HOSTNAME,
    user: Config.DATABASE_USERNAME,
    password: Config.DATABASE_PASSWORD,
    database: Config.DATABASE_NAME,
    connectionLimit: 10,
});
export var Database = {
    db: database,
};
    