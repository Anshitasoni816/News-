const mysql = require("mysql2");

const pool = mysql.createPool({ 

    host : "localhost",
    user : "root",
    password : "",
    database : "news_db",
    waitForConnection : true,
    connectionLimit : 10,
    queueLimit : 0,

 }).promise()


 const connectDB = async() => {
    try {
        const connection = await pool.getConnection();
        console.log(`mysql connected to ${connection.config.host}`);
        connection.release();
        return pool;
    } catch (error) {
        console.error("error connecting to my sql",error.message);
        process.exit(1);
    }
 }


 module.exports = {pool,connectDB};

