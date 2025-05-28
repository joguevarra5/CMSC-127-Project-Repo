import mysql from "mysql2";

const pool = mysql.createPool({
    host: 'localhost', // or 127.0.0.1
    user: 'orgadmin',
    password: 'useruser',
    database: 'orgdb',
}).promise();

// org functions

export async function getOrgs() {
    const [result] = await pool.query("SELECT * FROM org");
    return result;
}

export async function addOrg(org_name, classification) {
    await pool.query(
        `INSERT INTO org (org_name, classification)
        VALUES (?, ?)`
        , [org_name, classification]
    );
}

export async function updateOrg(newName, newClassification, org_id) {
    await pool.query(
        `UPDATE org
        SET org_name = ?, classification = ?
        WHERE org_id = ?`
        , [newName, newClassification, org_id]
    );
}

// member functions

export async function getMembersByOrg() {
    const [result] = await pool.query(
        `SELECT o.org_name, om.org_id, CONCAT(s.fname, ' ', s.lname) AS student_name, om.position, om.status, s.student_id, s.gender, s.degprog, om.join_date, om.committee
        FROM student AS s JOIN org_mem AS om ON s.student_id = om.student_id
        JOIN org AS o ON om.org_id = o.org_id ORDER BY o.org_id;`
    );
    return result;
}

export async function getMembersByOrgName(orgName) {
    const [result] = await pool.query(
        `SELECT o.org_name, om.org_id, CONCAT(s.fname, ' ', s.lname) AS student_name, om.position, om.status, s.student_id, s.gender, s.degprog, om.join_date, om.committee
         FROM student AS s 
         JOIN org_mem AS om ON s.student_id = om.student_id
         JOIN org AS o ON om.org_id = o.org_id
         WHERE o.org_name = ?
         ORDER BY o.org_id`,
        [orgName]
    );
    return result;
}

export async function editMember(position, assignment_date, org_id, student_id) {
    const [result] = await pool.query(
        `UPDATE org_mem
         SET position = ?, assignment_date = ?
         WHERE org_id = ? AND student_id = ?`,
        [position, assignment_date, org_id, student_id]
    );
    console.log("Update result:", result); // 🪵

    if (result.affectedRows === 0) {
        console.warn("No rows were updated. Check org_id and student_id.");
    }
    return result;
}

export async function deleteMember(org_id, student_id) {
    await pool.query(
        `DELETE FROM org_mem
        WHERE org_id = ? AND student_id = ?`
        , [org_id, student_id]
    );
}

export async function addMember(org_id, student_id, join_date, status, position, assignment_date, committee) {
    try {
        const [result] = await pool.query(
            `INSERT INTO org_mem (org_id, student_id, join_date, status, position, assignment_date, committee)
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [org_id, student_id, join_date, status, position, assignment_date, committee]
        );
        return result;
    } catch (error) {
        console.error("Failed to add member:", error);
        throw error;
    }
}

// fee functions

// getting all fees
export async function getAllFees() {
    const [rows] = await pool.query("SELECT * FROM fee");
    return rows;
}

// for getting fees for the whole organization
export async function getFeesByOrgName(orgName) {
    const [result] = await pool.query(
         `SELECT f.transaction_id, f.deadline_date, f.payment_date, f.payment_status, f.amount,
                s.student_id, CONCAT(s.fname, ' ', s.lname) AS student_name, o.org_name
         FROM fee AS f
         JOIN student AS s ON f.student_id = s.student_id
         JOIN org AS o ON f.org_id = o.org_id
         WHERE o.org_name = ?
         ORDER BY f.deadline_date DESC`,
        [orgName]
    );
    return result;
}

// for getting fees by a single student
export async function getFeesByStudentId(studentId) {
    const [result] = await pool.query(
        `SELECT f.transaction_id, f.deadline_date, f.payment_date, f.payment_status, f.amount,
                o.org_name, o.org_id
         FROM fee AS f
         JOIN org AS o ON f.org_id = o.org_id
         WHERE f.student_id = ?
         ORDER BY f.deadline_date DESC`,
        [studentId]
    );
    return result;
}

// for adding more fees for new semesters
export async function addFee(transaction_id, deadline_date, payment_date, payment_status, amount, student_id, org_id) {
    try {
        const [result] = await pool.query(
            `INSERT INTO fee (transaction_id, deadline_date, payment_date, payment_status, amount, student_id, org_id)
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [transaction_id, deadline_date, payment_date, payment_status, amount, student_id, org_id]
        );
        return result;
    } catch (error) {
        console.error("Failed to add fee:", error);
        throw error;
    }
}

export async function editFee(payment_date, payment_status, org_id, student_id) {
    const [result] = await pool.query(
        `UPDATE org_mem
         SET payment_date = ?, payment_status = ?
         WHERE org_id = ? AND student_id = ?`,
        [payment_date, payment_status, org_id, student_id]
    );
    console.log("Updated fee:", result);

    if (result.affectedRows === 0) {
        console.warn("No rows were updated. Check org_id and student_id.");
    }
    return result;
}

// student functions

export async function getPendingFees() {

}

// extra functions

export async function getFields() {

}

export default {
    getOrgs,
    addOrg,
    getMembersByOrg,
    getMembersByOrgName,
    editMember,
    deleteMember,
    addMember,
    addFee,
    editFee,
    getAllFees,
    getFeesByOrgName,
    getFeesByStudentId
};
