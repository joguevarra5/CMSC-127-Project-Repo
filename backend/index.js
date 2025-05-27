import mysql from "mysql2";

const pool = mysql.createPool({
    host: 'localhost', // or 127.0.0.1
    user: 'orgadmin',
    password: 'useruser',
    database: 'orgdb',
}).promise();

// org table 

export async function getOrgs() {
    const [result] = await pool.query("SELECT * FROM org");
    return result;
}

// org_mem table

// student

// fee

const result = await getOrgs();
console.log(result);