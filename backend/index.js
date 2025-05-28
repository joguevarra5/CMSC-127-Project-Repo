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
        `SELECT o.org_name, om.org_id, CONCAT(s.fname, ' ', s.lname) AS student_name, om.position AS role, om.status,
        s.student_id, s.gender, s.degprog, YEAR(om.join_date) AS batch, om.assignment_date, om.join_date, om.committee
        FROM student AS s JOIN org_mem AS om ON s.student_id = om.student_id
        JOIN org AS o ON om.org_id = o.org_id ORDER BY o.org_id;`
    );
    return result;
}

export async function getMembersByOrgName(orgName) {
    const [result] = await pool.query(
        `SELECT o.org_name, om.org_id, CONCAT(s.fname, ' ', s.lname) AS student_name, om.position AS role, om.status,
        s.student_id, s.gender, s.degprog, YEAR(om.join_date) AS batch, om.assignment_date, om.join_date, om.committee
        FROM student AS s 
        JOIN org_mem AS om ON s.student_id = om.student_id
        JOIN org AS o ON om.org_id = o.org_id
        WHERE o.org_name = ?
        ORDER BY o.org_id`,
        [orgName]
    );
    return result;
}

export async function getMembersByOrgNameSorted(orgName, conditional) {
    const [result] = await pool.query(
        `SELECT o.org_name, om.org_id, CONCAT(s.fname, ' ', s.lname) AS student_name, om.position AS role, om.status,
        s.student_id, s.gender, s.degprog, YEAR(om.join_date) AS batch, om.join_date, om.committee
        FROM student AS s 
        JOIN org_mem AS om ON s.student_id = om.student_id
        JOIN org AS o ON om.org_id = o.org_id
        WHERE o.org_name = ?
        ORDER BY o.org_id AND ${conditional}`,
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
    console.log("Update result:", result);

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
        `UPDATE fee
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

export async function getPendingFees() {
    const [result] = await pool.query(
        `SELECT f.transaction_id, f.deadline_date, f.payment_date, f.payment_status, f.amount,
                s.student_id, o.org_name, f.org_id
         FROM fee AS f
         JOIN student AS s ON f.student_id = s.student_id
         JOIN org AS o ON f.org_id = o.org_id
         WHERE f.payment_status = 'Pending'
         ORDER BY f.deadline_date DESC`
    );
    return result;
}

// student functions

export async function getStudents() {
    const [result] = await pool.query(
        `SELECT *
        FROM student`
    );
    return result;
}

export async function addStudent(student_id, fname, mname, lname, degprog, gender, graduation_date) {
    await pool.query(
        `INSERT INTO student
        VALUES (?, ?, ?, ?, ?, ?, ?)`
        , [student_id, fname, mname, lname, degprog, gender, graduation_date]
    );
}

export async function editStudent(fname, mname, lname, degprog, gender, student_id) {
    await pool.query(
        `UPDATE student
         SET fname = ?, mname = ?, lname = ?,
         degprog = ?, gender = ?
         WHERE student_id = ?`,
        [fname, mname, lname, degprog, gender, student_id]
    );
}

export async function deleteStudent(student_id) {
    await pool.query(
        `DELETE FROM student
        WHERE student_id = ?`
        , [student_id]
    );
}

// report functions

export async function getExecutiveMembers(start, end) {
    const [result] = await pool.query(
        `SELECT *
        FROM org_mem
        WHERE position IS NOT NULL AND YEAR(assignment_date) IN (?, ?)`
        , [start, end]
    );
    return result;
}

export async function getRoles(position) {
    const [result] = await pool.query(
        `SELECT *
        FROM org_mem
        WHERE position = ?
        ORDER BY YEAR(assignment_date) DESC`
        , [position]
    );
    return result;
}

export async function getPercentage() {
    const [result] = await pool.query(
        `SELECT (
        SELECT COUNT(*)
        FROM org_mem
        WHERE status = "Active"
        ) / (
        SELECT COUNT(*)
        FROM org_mem
        WHERE status = "Inactive"
        ) AS "active_inactive_percentage"`
    );
    return result;
}

export async function getAlumni(date) {
    const [result] = await pool.query(
        `SELECT *  
        FROM org_mem AS om  
        JOIN student AS s ON om.student_id = s.student_id  
        WHERE s.graduation_date > ?`
        , [date]
    );
    return result;
}

export default {
    getOrgs,
    addOrg,
    getMembersByOrg,
    getMembersByOrgName,
    getMembersByOrgNameSorted,
    editMember,
    deleteMember,
    addMember,
    getStudents,
    addStudent,
    editStudent,
    deleteStudent,
    getExecutiveMembers,
    getRoles,
    getPercentage,
    getAlumni,
    addFee,
    editFee,
    getAllFees,
    getFeesByOrgName,
    getFeesByStudentId
};
